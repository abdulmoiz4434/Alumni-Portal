import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import AuthPage from "./pages/auth/AuthPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/profile/Profile";
import Events from "./pages/dashboard/events/Events";
import Jobs from "./pages/dashboard/jobs/Jobs";
import Mentorship from "./pages/dashboard/mentorship/Mentorship";
import SuccessStories from "./pages/dashboard/stories/SuccessStories";
import Directory from "./pages/dashboard/directory/Directory";
import Messaging from "./pages/dashboard/messaging/Messaging";
import AdminAuth from "./pages/admin/Adminauth";
function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id; 

  return (
    <SocketProvider userId={userId}>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="events" element={<Events />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="stories" element={<SuccessStories />} />
            <Route path="directory" element={<Directory/>} />
            <Route path="messaging/:conversationId?" element={<Messaging />} />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}
export default App;