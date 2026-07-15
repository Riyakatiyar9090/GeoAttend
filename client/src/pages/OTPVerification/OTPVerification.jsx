import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiShield } from "react-icons/fi";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import OTPInput from "../../components/OTPInput/OTPInput";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import SuccessAnimation from "../../components/SuccessAnimation/SuccessAnimation";
import Loader from "../../components/Loader/Loader";
import "./OTPVerification.css";

const OTP_LENGTH = 6;
const TIMER_DURATION = 119; // 01:59

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    email = "your email",
    role = "student",
    name = "",
  } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [expired, setExpired] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [toast, setToast] = useState("");
  const [verified, setVerified] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleExpire = useCallback(() => setExpired(true), []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // TODO: replace with real API call, e.g.
      // await axios.post('/api/auth/verify-otp', { email, otp });
      await axios.post("http://localhost:5000/api/v1/auth/verify-otp", {
        email,
        otp,
        purpose: "email_verification",
      });
      setVerified(true);
      setTimeout(() => {
        navigate(role === "teacher" ? "/teacher" : "/student");
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again.",
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post("http://localhost:5000/api/v1/auth/resend-otp", {
        email,
        purpose: "email_verification",
      });

      setOtp("");
      setError("");
      setExpired(false);
      setRestartKey((k) => k + 1);
      showToast("A new code has been sent to your email");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Could not resend code. Please try again.",
      );
    }
  };

  if (verified) {
    return (
      <AuthLayout>
        <SuccessAnimation
          message={`Welcome${name ? `, ${name}` : ""}! Redirecting to your dashboard...`}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="otp-icon-badge">
        <FiShield />
      </div>

      <h1>Verify Your Email</h1>
      <p className="auth-subtitle">
        We've sent a 6-digit verification code to{" "}
        <span className="email-highlight">{email}</span>
      </p>

      <form onSubmit={handleVerify} noValidate>
        <OTPInput
          length={OTP_LENGTH}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (error) setError("");
          }}
          error={!!error}
          disabled={loading}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              className="otp-error-text"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="otp-timer-row">
          {!expired ? (
            <p>
              Code expires in{" "}
              <CountdownTimer
                duration={TIMER_DURATION}
                restartKey={restartKey}
                onExpire={handleExpire}
              />
            </p>
          ) : (
            <p className="otp-expired-text">Your code has expired</p>
          )}

          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
            disabled={!expired || resending}
          >
            {resending ? <Loader /> : "Resend Code"}
          </button>
        </div>

        <motion.button
          type="submit"
          className="otp-verify-btn"
          disabled={loading || otp.length !== OTP_LENGTH}
          whileHover={{ y: loading ? 0 : -3 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <Loader /> Verifying...
            </>
          ) : (
            <>
              Verify Code <FiArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <p className="auth-bottom-text">
        Wrong email? <a onClick={() => navigate("/register")}>Change Email</a>
      </p>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="otp-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
