import { motion } from "framer-motion";
import { FiCheck, FiLoader } from "react-icons/fi";
import "./ProgressStepper.css";

const STEPS = [
  "QR Code Verified",
  "Fetching GPS Location",
  "Comparing Distance",
  "Final Verification",
];

export default function ProgressStepper({ currentStep }) {
  return (
    <div className="progress-stepper">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={label} className="stepper-row">
            <motion.div
              className={`stepper-icon ${done ? "step-done" : active ? "step-active" : "step-pending"}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12 }}
            >
              {done ? (
                <FiCheck />
              ) : active ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FiLoader />
                </motion.span>
              ) : (
                <span className="step-number">{i + 1}</span>
              )}
            </motion.div>

            <div className="stepper-label-col">
              <span
                className={`stepper-label ${done ? "label-done" : active ? "label-active" : "label-pending"}`}
              >
                {label}
              </span>
              {done && <span className="stepper-sub">Completed</span>}
              {active && (
                <span className="stepper-sub active-sub">In progress...</span>
              )}
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`stepper-connector ${done ? "connector-done" : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
