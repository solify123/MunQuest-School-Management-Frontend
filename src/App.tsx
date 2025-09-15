import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import RequestApproval from './pages/RequestApproval';
import RequestUnderVerification from './pages/RequestUnderVerification';
import EventCreate from './pages/EventCreate';
import EventCreateSuccess from './pages/EventCreateSuccess';
import Organiser from './pages/Organiser';
import StudentProfile from './pages/student/StudentProfileCreate';
import TeacherProfile from './pages/teacher/TeacherProfileCreate';
import StudentProfilePage from './pages/student/StudentProfilePage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import StudentHome from './pages/student/StudentHome';
import TeacherHome from './pages/teacher/TeacherHome';
import StudentRegistration from './pages/student/StudentRegistration';
import StudentRegistrationSuccess from './pages/student/StudentRegistrationSuccess';
import StudentDelegatePage from './pages/student/StudentDelegatePage';
import TeacherRegistration from './pages/teacher/TeacherRegistration';
import TeacherRegistrationSuccess from './pages/teacher/TeacherRegistrationSuccess';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Authentication required */}
          <Route path="/home" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/request-approval" element={
            <PrivateRoute>
              <RequestApproval />
            </PrivateRoute>
          } />
          <Route path="/request-under-verification" element={
            <PrivateRoute>
              <RequestUnderVerification />
            </PrivateRoute>
          } />
          <Route path="/event-create" element={
            <PrivateRoute>
              <EventCreate />
            </PrivateRoute>
          } />
          <Route path="/event-create-success" element={
            <PrivateRoute>
              <EventCreateSuccess />
            </PrivateRoute>
          } />
          <Route path="/organiser" element={
            <PrivateRoute>
              <Organiser />
            </PrivateRoute>
          } />
          <Route path="/student-profile" element={
            <PrivateRoute>
              <StudentProfile />
            </PrivateRoute>
          } />
          <Route path="/student-profile-page" element={
            <PrivateRoute>
              <StudentProfilePage />
            </PrivateRoute>
          } />
          <Route path="/student-home" element={
            <PrivateRoute>
              <StudentHome />
            </PrivateRoute>
          } />
          <Route path="/student-registration" element={
            <PrivateRoute>
              <StudentRegistration />
            </PrivateRoute>
          } />
          <Route path="/student-registration-success" element={
            <PrivateRoute>
              <StudentRegistrationSuccess />
            </PrivateRoute>
          } />
          <Route path="/student-delegate-page" element={
            <PrivateRoute>
              <StudentDelegatePage />
            </PrivateRoute>
          } />
          <Route path="/teacher-profile" element={
            <PrivateRoute>
              <TeacherProfile />
            </PrivateRoute>
          } />
          <Route path="/teacher-profile-page" element={
            <PrivateRoute>
              <TeacherProfilePage />
            </PrivateRoute>
          } />
          <Route path="/teacher-home" element={
            <PrivateRoute>
              <TeacherHome />
            </PrivateRoute>
          } />
          <Route path="/teacher-registration" element={
            <PrivateRoute>
              <TeacherRegistration />
            </PrivateRoute>
          } />
          <Route path="/teacher-registration-success" element={
            <PrivateRoute>
              <TeacherRegistrationSuccess />
            </PrivateRoute>
          } />
          <Route path="/profile-page" element={
            <PrivateRoute>
              <ProfilePage userType="student" />
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;