import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { verifyOrganiserApi } from '../apis/Organisers';
import { getUserType } from '../utils/avatarUtils';
import { getAllUsersApi } from '../apis/Users';
import { getAllOrganisersApi } from '../apis/Organisers';
import { getAllEventsApi } from '../apis/Events';

// Define the context type
interface AppContextType {
  // User data
  userType: string | null;
  isOrganiser: boolean;
  isLoading: boolean;
  allUsers: any[];
  allOrganisers: any[];
  allEvents: any[];
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
  refreshEventsData: () => Promise<void>;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User state
  const [userType, setUserType] = useState<string | null>(null);
  const [isOrganiser, setIsOrganiser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allOrganisers, setAllOrganisers] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
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
  const refreshUserData = async () => {
    try {
      setIsLoading(true);

      const userTypeData = await getUserType();
      setUserType(userTypeData);

      const organiserResponse = await verifyOrganiserApi();
      setIsOrganiser(organiserResponse.success);

      const allUsersResponse = await getAllUsersApi();
      setAllUsers(allUsersResponse.data);

      const allOrganisersResponse = await getAllOrganisersApi();
      setAllOrganisers(allOrganisersResponse.data);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEventsData = async () => {
    const allEventsResponse = await getAllEventsApi();
    setAllEvents(allEventsResponse.data);
  };

  // Update dashboard statistics
  const updateDashboardStats = (newStats: Partial<AppContextType['dashboardStats']>) => {
    setDashboardStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  // Initialize user data on mount
  useEffect(() => {
    refreshUserData();
    refreshEventsData();
  }, []);

  const value: AppContextType = {
    userType,
    isOrganiser,
    isLoading,
    dashboardStats,
    allUsers,
    allEvents,
    setAllEvents,
    setAllUsers,
    setAllOrganisers,
    allOrganisers,
    setUserType,
    setIsOrganiser,
    updateDashboardStats,
    refreshUserData,
    refreshEventsData,
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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
