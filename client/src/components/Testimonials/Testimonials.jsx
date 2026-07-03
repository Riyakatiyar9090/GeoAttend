import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../SectionTitle/SectionTitle";
import "./Testimonials.css";

const reviews = [
  {
    name: "Aditi Sharma",
    role: "Assistant Professor, CSE",
    review:
      "GeoAttend cut our attendance time from ten minutes to under thirty seconds per class.",
  },
  {
    name: "Rahul Verma",
    role: "Student, ECE Dept",
    review:
      "No more passing around a sheet to sign for friends — the location check actually works.",
  },
  {
    name: "Dr. Neha Kapoor",
    role: "HOD, Information Technology",
    review:
      "The dashboard analytics gave us attendance insights we never had before.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Testimonials"
          title="Loved by teachers and students"
        />
        <div className="testimonial-slider">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="avatar">{reviews[index].name.charAt(0)}</div>
              <p className="review">"{reviews[index].review}"</p>
              <h4>{reviews[index].name}</h4>
              <span>{reviews[index].role}</span>
            </motion.div>
          </AnimatePresence>
          <div className="slider-controls">
            <button onClick={prev}>‹</button>
            <button onClick={next}>›</button>
          </div>
        </div>
      </div>
    </section>
  );
}
