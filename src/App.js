import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage.jsx"
import LandingPage from "../src/pages/LandingPage.jsx"
import CampaignPage from "../src/pages/CampaignPage.jsx"
import DocCenterPage from "../src/pages/DocCenterPage.jsx"
import BrokerComPage from "../src/pages/CMS/BrokerComPage.jsx"
import CategoriesPage from "../src/pages/CMS/CategoriesPage.jsx"
import EventCalendarPage from "../src/pages/CMS/EventCalendarPage.jsx"
import QuickLinksPage from "../src/pages/CMS/QuickLinksPage.jsx"
import CreateCampaignPage from "../src/pages/CreateCampaignPage.jsx"
import EditCampaignPage from "../src/pages/EditCampaignPage.jsx"
import EditDocumentPage from "../src/pages/EditDocumentPage.jsx"
import ViewDocumentPage from "../src/pages/ViewDocumentPage.jsx"
import CampaignDetailPage from "../src/pages/CampaignDetailPage.jsx"
import CreateDocCenterPage from "../src/pages/CreateDocCenterPage.jsx"
import SubCategoriesPage from "../src/pages/CMS/SubCategoriesPage.jsx"
import TestPage from "../src/pages/TestPage.jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/Landing" element={<LandingPage />} />
        <Route path="/Campaign" element={<CampaignPage />} />
        <Route path="/DocCenter" element={<DocCenterPage />} />
        <Route path="/BrokerCom" element={<BrokerComPage />} />
        <Route path="/Categories" element={<CategoriesPage />} />
        <Route path="/SubCategories" element={<SubCategoriesPage />} />
        <Route path="/EventCalendar" element={<EventCalendarPage />} />
        <Route path="/QuickLinks" element={<QuickLinksPage />} />
        <Route path="/CreateCampaign" element={<CreateCampaignPage />} />
        <Route path="/CreateDoc" element={<CreateDocCenterPage />} />
        <Route path="/EditCampaign" element={<EditCampaignPage />} />
        <Route path="/EditDocument" element={<EditDocumentPage />} />
        <Route path="/ViewDocument" element={<ViewDocumentPage />} />
        <Route path="/CampaignDetail" element={<CampaignDetailPage />} />
        <Route path="/Test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
