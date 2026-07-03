import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiSmartphone,
  FiLock,
  FiActivity,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import Hero from "../../components/Hero/Hero";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import CounterCard from "../../components/CounterCard/CounterCard";
import Testimonials from "../../components/Testimonials/Testimonials";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import "./LandingPage.css";

const features = [
  {
    icon: <FiSmartphone />,
    title: "QR Attendance",
    description: "Generate session-bound QR codes for instant check-in.",
  },
  {
    icon: <FiMapPin />,
    title: "Live Geolocation Verification",
    description: "Confirm a student's presence using real-time GPS matching.",
  },
  {
    icon: <FiLock />,
    title: "Secure Authentication",
    description: "Token-based login keeps every account protected.",
  },
  {
    icon: <FiActivity />,
    title: "Real-time Attendance",
    description: "Records sync to the dashboard the moment a scan succeeds.",
  },
  {
    icon: <FiUser />,
    title: "Teacher Dashboard",
    description: "Create sessions and monitor attendance trends at a glance.",
  },
  {
    icon: <FiUsers />,
    title: "Student Dashboard",
    description: "Students track their personal attendance history and stats.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />

      <section id="features" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Features"
            title="Everything you need, built in"
            subtitle="Powerful tools for teachers and students, wrapped in one simple platform."
          />
          <div className="features-grid">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="section section-dark">
        <div className="container">
          <SectionTitle light eyebrow="Impact" title="Trusted at scale" />
          <div className="stats-grid">
            <CounterCard value={12000} suffix="+" label="Students" />
            <CounterCard value={480} suffix="+" label="Teachers" />
            <CounterCard value={250000} suffix="+" label="Attendance Records" />
            <CounterCard value={9800} suffix="+" label="Sessions Created" />
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />

      <section className="section section-dark final-cta">
        <div className="container">
          <h2>Ready to modernize attendance on your campus?</h2>
          <p>Set up GeoAttend in minutes — no hardware required.</p>
          <Button variant="light" onClick={() => navigate("/select-role")}>
            Get Started Free
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
