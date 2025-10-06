import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, UnsavedChangesModal } from '../components/ui';
import { toast } from 'sonner';
import { eventImagefileUploadApi, getEventByIdApi, updateEventApi } from '../apis/Events';
import PageLoader from '../components/PageLoader';
import {
  DashboardPage,
  EventDetailsPage,
  LeadershipRolesPage,
  CommitteesPage,
  AgendaPage,
  OrganiserNavigation
} from '../components/organiser';

const OrganiserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeStep, setActiveStep] = useState('dashboard');
  const [eventName, setEventName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [locality, setLocality] = useState('');
  const [school, setSchool] = useState('');
  const [area, setArea] = useState('');
  const [feesPerDelegate, setFeesPerDelegate] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [locality_id, setLocality_id] = useState('');
  const [school_id, setSchool_id] = useState('');
  const [area_id, setArea_id] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Unsaved changes states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Original values for resetting
  const [originalValues, setOriginalValues] = useState({
    eventName: '',
    eventDescription: '',
    eventStartDate: '',
    eventEndDate: '',
    school: '',
    locality: '',
    numberOfSeats: '',
    feesPerDelegate: '',
    website: '',
    instagram: '',
    coverImage: ''
  });

  // Leadership Roles state


  // Agenda state
  const [activeAgendaCommitteeType, setActiveAgendaCommitteeType] = useState('country');
  const [activeAgendaCommittee, setActiveAgendaCommittee] = useState('UNGA');
  const [agendas, setAgendas] = useState([
    { id: 1, title: 'Climate Change in Africa' }
  ]);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Climate Change Background Guide.pdf' }
  ]);
  const [editingAgenda, setEditingAgenda] = useState<number | null>(null);
  const [editingDocument, setEditingDocument] = useState<number | null>(null);

  useEffect(() => {
    const getCurrentEvents = async () => {
      try {
        const response = await getEventByIdApi(eventId || '');
        if (response.success) {
          if (response.data && response.data.length > 0) {
            const eventData = response.data[0];
            setEventName(eventData.name);
            setCoverImage(eventData.cover_image);
            setEventDescription(eventData.description);
            setEventStartDate(eventData.start_date);
            setEventEndDate(eventData.end_date);
            setLocality(eventData.locality.name);
            setSchool(eventData.school.name);
            setArea(eventData.school.name);
            setFeesPerDelegate(eventData.fees_per_delegate);
            setNumberOfSeats(eventData.number_of_seats);
            setWebsite(eventData.website);
            setInstagram(eventData.instagram);
            setLocality_id(eventData.locality.id);
            setSchool_id(eventData.school.id);
            setArea_id(eventData.school.area_id);

            // Store original values for resetting
            setOriginalValues({
              eventName: eventData.name,
              eventDescription: eventData.description,
              eventStartDate: eventData.start_date,
              eventEndDate: eventData.end_date,
              school: eventData.school.name,
              locality: eventData.locality.name,
              numberOfSeats: eventData.number_of_seats,
              feesPerDelegate: eventData.fees_per_delegate,
              website: eventData.website,
              instagram: eventData.instagram,
              coverImage: eventData.cover_image
            });

            // Calculate total revenue
            calculateTotalRevenue(eventData.number_of_seats, eventData.fees_per_delegate);
          }
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error('Error fetching events:', error);
        toast.error(error.message);
      }
    };
    getCurrentEvents();
  }, [eventId, navigate]);

  const handleStepChange = (step: string) => {
    // Check if there are unsaved changes and we're not already on the event-details page
    if (hasUnsavedChanges && activeStep === 'event-details' && step !== 'event-details') {
      setPendingNavigation(step);
      setShowUnsavedChangesModal(true);
      return;
    }

    setActiveStep(step);
  };

  // Handle field edit
  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  // Auto-save field edit when value changes
  const handleFieldChange = (field: string, value: string) => {
    setTempValue(value);
    setHasUnsavedChanges(true); // Mark as having unsaved changes

    // Update the corresponding useState variable based on the field
    switch (field) {
      case 'name':
        setEventName(value);
        break;
      case 'description':
        setEventDescription(value);
        break;
      case 'date':
        // Handle date parsing if needed
        break;
      case 'school_name':
        setSchool(value);
        break;
      case 'locality':
        setLocality(value);
        break;
      case 'number_of_seats':
        setNumberOfSeats(value);
        calculateTotalRevenue(value, feesPerDelegate);
        break;
      case 'fees_per_delegate':
        setFeesPerDelegate(value);
        calculateTotalRevenue(numberOfSeats, value);
        break;
      case 'website':
        setWebsite(value);
        break;
      case 'instagram':
        setInstagram(value);
        break;
      default:
        break;
    }
  };

  // Cancel field edit
  const handleCancelEdit = () => {
    if (editingField) {
      // Reset the field value to its original state
      switch (editingField) {
        case 'name':
          setEventName(eventName);
          break;
        case 'description':
          setEventDescription(eventDescription);
          break;
        case 'date':
          // Handle date reset if needed
          break;
        case 'school_name':
          setSchool(school);
          break;
        case 'locality':
          setLocality(locality);
          break;
        case 'number_of_seats':
          setNumberOfSeats(numberOfSeats);
          calculateTotalRevenue(numberOfSeats, feesPerDelegate);
          break;
        case 'fees_per_delegate':
          setFeesPerDelegate(feesPerDelegate);
          calculateTotalRevenue(numberOfSeats, feesPerDelegate);
          break;
        case 'website':
          setWebsite(website);
          break;
        case 'instagram':
          setInstagram(instagram);
          break;
        default:
          break;
      }
    }
    setEditingField(null);
    setTempValue('');
    setShowDatePicker(false); // Close date picker when canceling edit
    setHasUnsavedChanges(false); // Reset unsaved changes flag
  };

  // Handle cover image upload (same as profile page avatar upload)
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files) {
        // Set loading state based on image type
        setIsUploadingCoverImage(true);
        const response = await eventImagefileUploadApi(files?.[0] as File);
        if (response.success) {
          toast.success(response.message);
          setCoverImage(response.imageUrl);
          setHasUnsavedChanges(true); // Mark as having unsaved changes
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploadingCoverImage(false);
    }

  };

  // Date picker handlers
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setEventStartDate(startDate);
    setEventEndDate(endDate);
    setHasUnsavedChanges(true); // Mark as having unsaved changes
    // Keep the date picker open so user can adjust dates if needed
  };

  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };



  // Agenda handlers
  const handleAgendaCommitteeTypeChange = (type: string) => {
    setActiveAgendaCommitteeType(type);
  };

  const handleAgendaCommitteeChange = (committee: string) => {
    setActiveAgendaCommittee(committee);
  };

  const handleAgendaEdit = (agendaId: number, currentValue: string) => {
    setEditingAgenda(agendaId);
    setTempValue(currentValue);
  };

  const handleAgendaChange = (value: string) => {
    setTempValue(value);
  };

  const handleAgendaSave = () => {
    if (editingAgenda) {
      setAgendas(prev => prev.map(agenda =>
        agenda.id === editingAgenda
          ? { ...agenda, title: tempValue }
          : agenda
      ));
    }
    setEditingAgenda(null);
    setTempValue('');
  };

  const handleAgendaCancel = () => {
    setEditingAgenda(null);
    setTempValue('');
  };

  const handleAgendaDelete = (agendaId: number) => {
    setAgendas(prev => prev.filter(agenda => agenda.id !== agendaId));
  };

  const handleAddAgenda = () => {
    const newAgenda = {
      id: Math.max(...agendas.map(a => a.id)) + 1,
      title: ''
    };
    setAgendas([...agendas, newAgenda]);
    setEditingAgenda(newAgenda.id);
    setTempValue('');
  };

  // Document handlers
  const handleDocumentEdit = (documentId: number, currentValue: string) => {
    setEditingDocument(documentId);
    setTempValue(currentValue);
  };

  const handleDocumentChange = (value: string) => {
    setTempValue(value);
  };

  const handleDocumentSave = () => {
    if (editingDocument) {
      setDocuments(prev => prev.map(document =>
        document.id === editingDocument
          ? { ...document, name: tempValue }
          : document
      ));
    }
    setEditingDocument(null);
    setTempValue('');
  };

  const handleDocumentCancel = () => {
    setEditingDocument(null);
    setTempValue('');
  };

  const handleDocumentDelete = (documentId: number) => {
    setDocuments(prev => prev.filter(document => document.id !== documentId));
  };

  const handleDocumentUpload = (file: File) => {
    const newDocument = {
      id: Math.max(...documents.map(d => d.id)) + 1,
      name: file.name,
      file: file
    };
    setDocuments([...documents, newDocument]);
    toast.success('Document uploaded successfully');
  };

  const calculateTotalRevenue = (seats: string, fees: string) => {
    const seatsNum = Number(seats);
    const feesNum = Number(fees);
    if (!isNaN(seatsNum) && !isNaN(feesNum) && seatsNum > 0 && feesNum > 0) {
      setTotalRevenue((seatsNum * feesNum).toString());
    } else {
      setTotalRevenue('');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      setIsSaving(true);
      calculateTotalRevenue(numberOfSeats, feesPerDelegate);
      const response = await updateEventApi(eventId || '', eventName, eventDescription, eventStartDate, eventEndDate, coverImage, locality_id, school_id, area_id, numberOfSeats, feesPerDelegate, totalRevenue, website, instagram);
      if (response.success) {
        toast.success(response.message);
        setHasUnsavedChanges(false); // Reset unsaved changes flag after successful save

        // Update original values to current values after successful save
        setOriginalValues({
          eventName,
          eventDescription,
          eventStartDate,
          eventEndDate,
          school,
          locality,
          numberOfSeats,
          feesPerDelegate,
          website,
          instagram,
          coverImage
        });
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error('Failed to update event: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Unsaved changes modal handlers
  const handleKeepEditing = () => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  };

  const handleDiscardChanges = () => {
    // Reset all fields to their original values
    setEventName(originalValues.eventName);
    setEventDescription(originalValues.eventDescription);
    setEventStartDate(originalValues.eventStartDate);
    setEventEndDate(originalValues.eventEndDate);
    setSchool(originalValues.school);
    setLocality(originalValues.locality);
    setNumberOfSeats(originalValues.numberOfSeats);
    setFeesPerDelegate(originalValues.feesPerDelegate);
    setWebsite(originalValues.website);
    setInstagram(originalValues.instagram);
    setCoverImage(originalValues.coverImage);

    // Recalculate total revenue with original values
    calculateTotalRevenue(originalValues.numberOfSeats, originalValues.feesPerDelegate);

    // Reset editing states
    setEditingField(null);
    setTempValue('');
    setShowDatePicker(false);
    setHasUnsavedChanges(false);

    // Close modal and navigate
    setShowUnsavedChangesModal(false);
    if (pendingNavigation) {
      setActiveStep(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const steps = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'event-details', name: 'Event Details' },
    { id: 'leadership-roles', name: 'Leadership Roles' },
    { id: 'committees', name: 'Committees' },
    { id: 'agendas', name: 'Agendas' },
    { id: 'delegates', name: 'Delegates' },
    { id: 'general-documents', name: 'General Documents' }
  ];


  // Leadership Roles component
  const renderLeadershipRoles = () => {
    return <LeadershipRolesPage />;
  };

  // Committees component
  const renderCommittees = () => {
    return <CommitteesPage />;
  };

  // Agenda component
  const renderAgenda = () => {
    return (
      <AgendaPage
        activeCommitteeType={activeAgendaCommitteeType}
        activeCommittee={activeAgendaCommittee}
        agendas={agendas}
        documents={documents}
        editingAgenda={editingAgenda}
        editingDocument={editingDocument}
        tempValue={tempValue}
        isSaving={isSaving}
        onCommitteeTypeChange={handleAgendaCommitteeTypeChange}
        onCommitteeChange={handleAgendaCommitteeChange}
        onAgendaEdit={handleAgendaEdit}
        onAgendaChange={handleAgendaChange}
        onAgendaSave={handleAgendaSave}
        onAgendaCancel={handleAgendaCancel}
        onAgendaDelete={handleAgendaDelete}
        onAddAgenda={handleAddAgenda}
        onDocumentEdit={handleDocumentEdit}
        onDocumentChange={handleDocumentChange}
        onDocumentSave={handleDocumentSave}
        onDocumentCancel={handleDocumentCancel}
        onDocumentDelete={handleDocumentDelete}
        onDocumentUpload={handleDocumentUpload}
      />
    );
  };

  const renderDashboard = () => {
    return (
      <DashboardPage
        eventName={eventName}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        locality={locality}
        area={area}
        feesPerDelegate={feesPerDelegate}
        numberOfSeats={numberOfSeats}
        totalRevenue={totalRevenue}
      />
    );
  };

  const renderEventDetails = () => {
    return (
      <EventDetailsPage
        eventName={eventName}
        coverImage={coverImage}
        eventDescription={eventDescription}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        school={school}
        locality={locality}
        numberOfSeats={numberOfSeats}
        feesPerDelegate={feesPerDelegate}
        totalRevenue={totalRevenue}
        website={website}
        instagram={instagram}
        isUploadingCoverImage={isUploadingCoverImage}
        editingField={editingField}
        tempValue={tempValue}
        showDatePicker={showDatePicker}
        onFieldEdit={handleEditField}
        onFieldChange={handleFieldChange}
        onCancelEdit={handleCancelEdit}
        onCoverImageUpload={handleCoverImageUpload}
        onDateRangeChange={handleDateRangeChange}
        onDatePickerToggle={handleDatePickerToggle}
        onDatePickerClose={handleDatePickerClose}
        onUpdateEvent={handleUpdateEvent}
        isSaving={isSaving}
      />
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'dashboard':
        return renderDashboard();
      case 'event-details':
        return renderEventDetails();
      case 'leadership-roles':
        return renderLeadershipRoles();
      case 'committees':
        return renderCommittees();
      case 'agendas':
        return renderAgenda();
      case 'delegates':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Delegates</h2><p className="text-gray-500 mt-2">Delegates management coming soon...</p></div>;
      case 'general-documents':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">General Documents</h2><p className="text-gray-500 mt-2">General documents management coming soon...</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <PageLoader loadingText="Loading Organiser Dashboard...">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <Header maxWidth="max-w-[88rem]" />

        {/* Main Content */}
        <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
          {/* Page Title and Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-medium text-[#C2A46D] mb-6">
                Organiser &gt; {steps.find(step => step.id === activeStep)?.name || 'Dashboard'}
              </h1>

              {/* Step Navigation */}
              <OrganiserNavigation
                steps={steps}
                activeStep={activeStep}
                onStepChange={handleStepChange}
              />
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedChangesModal}
        onKeepEditing={handleKeepEditing}
        onDiscardChanges={handleDiscardChanges}
      />
    </PageLoader>
  );
};

export default OrganiserDashboard;
