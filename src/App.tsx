import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import StudentProfile from './pages/student/StudentProfileCreate';
import TeacherProfile from './pages/teacher/TeacherProfileCreate';
import StudentProfilePage from './pages/student/StudentProfilePage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import StudentHome from './pages/student/StudentHome';
import TeacherHome from './pages/teacher/TeacherHome';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-profile-page" element={<StudentProfilePage />} />
          <Route path="/student-home" element={<StudentHome />} />  
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/teacher-profile-page" element={<TeacherProfilePage />} />
          <Route path="/teacher-home" element={<TeacherHome />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;