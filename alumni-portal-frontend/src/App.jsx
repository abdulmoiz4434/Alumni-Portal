import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/profile/Profile";
import Events from "./pages/dashboard/events/Events";
import Jobs from "./pages/dashboard/jobs/Jobs";
import Mentorship from "./pages/dashboard/mentorship/Mentorship";
import SuccessStories from "./pages/dashboard/stories/SuccessStories";
import Chat from "./pages/dashboard/networking/Networking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="events" element={<Events />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="stories" element={<SuccessStories />} />
          <Route path="networking" element={<Chat />} />


        </Route>
      </Routes>
    </Router>
  );
}

export default App;
