// Landing page UI for SSU homepage (static, no backend logic)
import Header from "@/components/landing/Header";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Programs from "@/components/landing/Programs";
import Features from "@/components/landing/Features";
import Highlights from "@/components/landing/Highlights";
import News from "@/components/landing/News";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import DegreePrograms from "@/components/landing/DegreeProgram";
import Faq from "@/components/landing/Faq";
import AdmissionProcess from "@/components/landing/AdmissionProcess";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top header with contact info */}
      {/* <Header /> */}
      {/* Main navigation bar */}
      <Navbar />
      {/* Hero section */}
      <Hero />
      {/* About section */}
      <About />
      {/* Degree Programs section */}
      <Programs />
      {/*degree programs  */}
      <DegreePrograms />
      {/* Features section */}
      <Features />
      {/* Admission Process section */}
      <AdmissionProcess />
      {/* FAQ section */}
      <Faq />
      {/* News/events section */}
      <News />
      {/* Call-to-action section */}
      <CTA />
      {/* Footer */}
      <Footer />
    </div>
  );
}
