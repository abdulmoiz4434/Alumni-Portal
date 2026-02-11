import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import Layout from "./pages/modules/Layout";
import Dashboard from "./pages/modules/dashboard/Dashboard";
import Profile from "./pages/modules/profile/Profile";
import Events from "./pages/modules/events/Events";
import Jobs from "./pages/modules/jobs/Jobs";
import Mentorship from "./pages/modules/mentorship/Mentorship";
import SuccessStories from "./pages/modules/stories/SuccessStories";
import CareerInsights from "./pages/modules/careerInsights/CareerInsights";
import Directory from "./pages/modules/directory/Directory";
import Messaging from "./pages/modules/messaging/Messaging";
import AdminAuth from "./pages/admin/Adminauth";
import Notifications from "./pages/modules/notifications/Notifications";

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/modules" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="events" element={<Events />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="stories" element={<SuccessStories />} />
            <Route path="careerInsights" element={<CareerInsights />} />
            <Route path="directory" element={<Directory />} />
            <Route path="messaging/:conversationId?" element={<Messaging />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
  );
}
export default App;
