import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Products from "./pages/Products";

import Admin from "./pages/Admin";
import BackgroundAnimation from "./components/BackgroundAnimation";

import useScrollReveal from "./hooks/useScrollReveal";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  useScrollReveal();

  return (
    <>
      <ScrollToTop />
      <WhatsAppButton />
      <BackgroundAnimation />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
