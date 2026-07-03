import { motion } from "framer-motion";
import SectionTitle from "../SectionTitle/SectionTitle";
import "./HowItWorks.css";

const steps = [
  {
    title: "Teacher Creates Session",
    desc: "Start an attendance session for the class in one tap.",
  },
  {
    title: "QR Generated",
    desc: "A unique, time-bound QR code is generated instantly.",
  },
  {
    title: "Student Scans QR",
    desc: "Students scan the code using the GeoAttend app.",
  },
  {
    title: "Location Verified",
    desc: "The student's GPS location is matched to the classroom.",
  },
  {
    title: "Attendance Recorded",
    desc: "Verified attendance is saved to the dashboard in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Workflow"
          title="How GeoAttend Works"
          subtitle="Five simple steps from session creation to verified attendance."
        />
        <div className="timeline">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="timeline-step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
