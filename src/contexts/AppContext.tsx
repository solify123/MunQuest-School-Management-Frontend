import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getAllUsersApi } from '../apis/Users';
import { getAllOrganisersApi } from '../apis/Organisers';
import { getAllLocalitiesApi } from '../apis/localities';
import { getAllSchoolsApi } from '../apis/schools';
import { getAllAreasApi } from '../apis/areas';
import { getAllEventsApi } from '../apis/Events';
import { getAllLeadershipRolesApi } from '../apis/LeadershipRoles';
import { useSupabaseAuth } from './SupabaseAuthContext';
import { toast } from 'sonner';

// Define the context type
interface AppContextType {
  // User data
  userType: string | null;
  isOrganiser: boolean;
  isLoading: boolean;
  allUsers: any[];
  allOrganisers: any[];
  allEvents: any[];
  allLeadershipRoles: any[];
  // Dashboard statistics
  dashboardStats: {
    eventsUpcoming: number;
    eventsCompleted: number;
    users: number;
    organisers: number;
    pendingApprovals: number;
    schools: number;
  };

  // Actions
  setUserType: (type: string | null) => void;
  setIsOrganiser: (isOrganiser: boolean) => void;
  updateDashboardStats: (stats: Partial<AppContextType['dashboardStats']>) => void;
  refreshUserData: () => Promise<void>;
  setAllUsers: (users: any[]) => void;
  setAllOrganisers: (organisers: any[]) => void;
  setAllEvents: (events: any[]) => void;
  setAllLocalities: (localities: any[]) => void;
  setAllSchools: (schools: any[]) => void;
  setAllAreas: (areas: any[]) => void;
  setAllLeadershipRoles: (leadershipRoles: any[]) => void;
  refreshEventsData: () => Promise<void>;
  refreshLocalitiesData: () => Promise<void>;
  refreshSchoolsData: () => Promise<void>;
  refreshAreasData: () => Promise<void>;
  refreshLeadershipRolesData: () => Promise<void>;
  allLocalities: any[];
  allSchools: any[];
  allAreas: any[];
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user: supabaseUser, session, loading: authLoading } = useSupabaseAuth();

  // User state
  const [userType, setUserType] = useState<string | null>(null);
  const [isOrganiser, setIsOrganiser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allOrganisers, setAllOrganisers] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allLocalities, setAllLocalities] = useState<any[]>([]);
  const [allSchools, setAllSchools] = useState<any[]>([]);
  const [allAreas, setAllAreas] = useState<any[]>([]);
  const [allLeadershipRoles, setAllLeadershipRoles] = useState<any[]>([]);
  // Dashboard statistics state
  const [dashboardStats, setDashboardStats] = useState({
    eventsUpcoming: 5,
    eventsCompleted: 5,
    users: 900,
    organisers: 80,
    pendingApprovals: 3,
    schools: 70
  });

  // Check user type and organiser status
  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get user type from Supabase user metadata
      if (supabaseUser?.user_metadata?.role) {
        setUserType(supabaseUser.user_metadata.role);
      } else {
        setUserType('student'); // default
      }

      // Only make API calls if user is authenticated
      if (session?.access_token) {
        const allUsersResponse = await getAllUsersApi();
        if (allUsersResponse.success) {
          setAllUsers(allUsersResponse.data);
        }
        else {
          toast.error(allUsersResponse.message);
        }

        const allOrganisersResponse = await getAllOrganisersApi();
        setAllOrganisers(allOrganisersResponse.data);

        const allLeadershipRolesResponse = await getAllLeadershipRolesApi();
        setAllLeadershipRoles(allLeadershipRolesResponse.data);
      }
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    } finally {
      setIsLoading(false);
    }
  }, [supabaseUser, session]);

  const refreshEventsData = useCallback(async () => {
    try {
      const allEventsResponse = await getAllEventsApi();
      if (allEventsResponse.success) {
        setAllEvents(allEventsResponse.data);
      }
      else {
        toast.error(allEventsResponse.message);
      }
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    }
  }, []);

  const refreshLocalitiesData = useCallback(async () => {
    try {
      const allLocalitiesResponse = await getAllLocalitiesApi();
      if (allLocalitiesResponse.success) {
        setAllLocalities(allLocalitiesResponse.data);
      }
      else {
        toast.error(allLocalitiesResponse.message);
      }
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    }
  }, []);

  const refreshSchoolsData = useCallback(async () => {
    try {
      const allSchoolsResponse = await getAllSchoolsApi();
      if (allSchoolsResponse.success) {
        setAllSchools(allSchoolsResponse.data);
      }
      else {
        toast.error(allSchoolsResponse.message);
      }
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    }
  }, []);

  const refreshAreasData = useCallback(async () => {
    try {
      const allAreasResponse = await getAllAreasApi();
      if (allAreasResponse.success) {
        setAllAreas(allAreasResponse.data);
      }
      else {
        toast.error(allAreasResponse.message);
      }
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    }
  }, []);

  const refreshLeadershipRolesData = useCallback(async () => {
    try {
      const allLeadershipRolesResponse = await getAllLeadershipRolesApi();
      if (allLeadershipRolesResponse.success) {
        setAllLeadershipRoles(allLeadershipRolesResponse.data);
      }
      else {
        toast.error(allLeadershipRolesResponse.message);
      }
      setAllLeadershipRoles(allLeadershipRolesResponse.data || []);
    } catch (error) {
      toast.error('JWT token is expired. Please login again.');
    }
  }, []);

  // Update dashboard statistics
  const updateDashboardStats = (newStats: Partial<AppContextType['dashboardStats']>) => {
    setDashboardStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  // Initialize user data when Supabase auth state changes
  useEffect(() => {
    if (!authLoading) {
      refreshUserData();
      refreshEventsData();
      refreshLeadershipRolesData();
      refreshSchoolsData();
      refreshLocalitiesData();
      refreshAreasData();
    }
  }, [supabaseUser, session, authLoading, refreshUserData, refreshEventsData, refreshLeadershipRolesData, refreshSchoolsData, refreshLocalitiesData, refreshAreasData]);

  const value: AppContextType = {
    userType,
    isOrganiser,
    isLoading,
    dashboardStats,
    allUsers,
    allEvents,
    allLocalities,
    allSchools,
    allAreas,
    allLeadershipRoles,
    setAllEvents,
    setAllLocalities,
    setAllSchools,
    setAllAreas,
    setAllLeadershipRoles,
    setAllUsers,
    setAllOrganisers,
    allOrganisers,
    setUserType,
    setIsOrganiser,
    updateDashboardStats,
    refreshUserData,
    refreshEventsData,
    refreshLocalitiesData,
    refreshSchoolsData,
    refreshAreasData,
    refreshLeadershipRolesData,
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    console.error('useApp - Context is undefined, this should not happen if component is wrapped in AppProvider');
    // Instead of throwing an error, return a default context to prevent crashes
    return {
      userType: null,
      isOrganiser: false,
      isLoading: true,
      allUsers: [],
      allOrganisers: [],
      allEvents: [],
      allLocalities: [],
      allSchools: [],
      allAreas: [],
      allLeadershipRoles: [],
      dashboardStats: {
        eventsUpcoming: 0,
        eventsCompleted: 0,
        users: 0,
        organisers: 0,
        pendingApprovals: 0,
        schools: 0
      },
      setUserType: () => { },
      setIsOrganiser: () => { },
      updateDashboardStats: () => { },
      refreshUserData: async () => { },
      setAllUsers: () => { },
      setAllOrganisers: () => { },
      setAllEvents: () => { },
      setAllLocalities: () => { },
      setAllSchools: () => { },
      setAllAreas: () => { },
      setAllLeadershipRoles: () => { },
      refreshEventsData: async () => { },
      refreshLocalitiesData: async () => { },
      refreshSchoolsData: async () => { },
      refreshAreasData: async () => { },
      refreshLeadershipRolesData: async () => { }
    };
  }
  return context;
};

export default AppContext;
