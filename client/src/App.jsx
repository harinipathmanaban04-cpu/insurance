import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarInsurance from './pages/CarInsurance';
import BikeInsurance from './pages/BikeInsurance';
import CommercialInsurance from './pages/CommercialInsurance';
import LifeFamilyInsurance from './pages/LifeFamilyInsurance';
import AboutUs from './pages/AboutUs';
import ClaimsAssistance from './pages/ClaimsAssistance';
import ContactUs from './pages/ContactUs';
import AdminEnquiries from './pages/AdminEnquiries';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id) || document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#171717] antialiased w-full max-w-full overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insurance/car" element={<CarInsurance />} />
          <Route path="/insurance/bike" element={<BikeInsurance />} />
          <Route path="/insurance/commercial" element={<CommercialInsurance />} />
          <Route path="/insurance/life-family" element={<LifeFamilyInsurance />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/claims" element={<ClaimsAssistance />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin" element={<AdminEnquiries />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
