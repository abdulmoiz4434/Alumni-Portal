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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HelpCenter from "./pages/resources/helpCenter/HelpCenter";
import FAQs from "./pages/resources/faqs/FAQs";
import Privacy from "./pages/resources/privacyPolicy/PrivacyPolicy";
import Terms from "./pages/resources/termsOfService/TermsOfService";
import Support from "./pages/resources/contactSupport/ContactSupport";

function App() {
  return (
    <Router>
      <Routes>
  {/* Public pages without layout */}
  <Route path="/" element={<AuthPage />} />
  <Route path="/admin" element={<AdminAuth />} />

  {/* All pages with topbar/sidebar/footer */}
  <Route
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    {/* Dashboard & Modules */}
    <Route path="/modules" element={<Dashboard />} />
    <Route path="/modules/profile" element={<Profile />} />
    <Route path="/modules/events" element={<Events />} />
    <Route path="/modules/jobs" element={<Jobs />} />
    <Route path="/modules/mentorship" element={<Mentorship />} />
    <Route path="/modules/stories" element={<SuccessStories />} />
    <Route path="/modules/careerInsights" element={<CareerInsights />} />
    <Route path="/modules/directory" element={<Directory />} />
    <Route path="/modules/notifications" element={<Notifications />} />
    <Route path="/modules/messaging/:conversationId?" element={<Messaging />} />

    {/* Footer resource pages */}
    <Route path="/helpCenter" element={<HelpCenter />} />
    <Route path="/faqs" element={<FAQs />} />
    <Route path="/privacyPolicy" element={<Privacy />} />
    <Route path="/termsOfService" element={<Terms />} />
    <Route path="/contactSupport" element={<Support />} />
  </Route>
</Routes>
    </Router>
  );
}

export default App;