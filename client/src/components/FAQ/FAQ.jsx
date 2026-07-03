import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../SectionTitle/SectionTitle";
import "./FAQ.css";

const faqs = [
  {
    q: "How does location verification work?",
    a: "GeoAttend compares the student device GPS coordinates against the geofenced classroom radius set by the teacher at session creation.",
  },
  {
    q: "Can a student mark attendance for someone else?",
    a: "No. Each QR session is time-bound and tied to the scanning device plus the verified location, preventing proxy attendance.",
  },
  {
    q: "Does it work without internet?",
    a: "A stable connection is required at the moment of scanning so attendance can be verified and recorded in real time.",
  },
  {
    q: "Is the data secure?",
    a: "All authentication uses secure tokens, and attendance records are stored in an access-controlled database.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={item.q} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.q}
                <span className={`faq-icon ${open === i ? "rotate" : ""}`}>
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
