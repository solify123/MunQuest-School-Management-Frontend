import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-approval" element={<RequestApproval />} />
          <Route path="/request-under-verification" element={<RequestUnderVerification />} />
          <Route path="/event-create" element={<EventCreate />} />
          <Route path="/event-create-success" element={<EventCreateSuccess />} />
          <Route path="/organiser" element={<Organiser />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-profile-page" element={<StudentProfilePage />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/student-registration-success" element={<StudentRegistrationSuccess />} />
          <Route path="/student-delegate-page" element={<StudentDelegatePage />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/teacher-profile-page" element={<TeacherProfilePage />} />
          <Route path="/teacher-home" element={<TeacherHome />} />
          <Route path="/teacher-registration" element={<TeacherRegistration />} />
          <Route path="/teacher-registration-success" element={<TeacherRegistrationSuccess />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;