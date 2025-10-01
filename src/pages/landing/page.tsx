import CtaSection from "../../components/landing/CtaSection";
import Faq from "../../components/landing/Faq";
import FeaturesSection from "../../components/landing/FeaturesSection";
import Footer from "../../components/landing/Footer";
import Hero from "../../components/landing/Hero";
import Impact from "../../components/landing/Impact";
import Nav from "../../components/landing/Nav";
import Requirement from "../../components/landing/Requirement";

function LandingPage() {
  return (
    <div className="manrope bg-white w-screen">
      <Nav />
      <Hero />
      <Impact />
      <Requirement />
      <FeaturesSection />
      <Faq />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
