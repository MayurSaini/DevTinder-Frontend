import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Navbar from "./components/NavBar";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import SiteInfoPage from "./pages/SiteInfoPage";
import SiteFooter from "./components/SiteFooter";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/about" element={<SiteInfoPage page="about" />} />
        <Route path="/contact" element={<SiteInfoPage page="contact" />} />
        <Route path="/terms" element={<SiteInfoPage page="terms" />} />
        <Route path="/privacy" element={<SiteInfoPage page="privacy" />} />
        <Route path="/refund-policy" element={<SiteInfoPage page="refund" />} />
        <Route path="/shipping-policy" element={<SiteInfoPage page="delivery" />} />
        <Route path="/pricing" element={<SiteInfoPage page="pricing" />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}

export default App;
