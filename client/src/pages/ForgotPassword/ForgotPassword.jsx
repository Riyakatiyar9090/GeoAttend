import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import Loader from "../../components/Loader/Loader";
import SuccessAnimation from "../../components/SuccessAnimation/SuccessAnimation";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with real API call, e.g.
      // await axios.post('/api/auth/forgot-password', { email, role });
      await new Promise((resolve, reject) =>
        setTimeout(
          () => (email === "notfound@geoattend.com" ? reject() : resolve()),
          1200,
        ),
      );

      setSent(true);
      showToast("OTP has been sent successfully.");
      setTimeout(() => {
        navigate("/reset-password", { state: { email, role } });
      }, 1600);
    } catch {
      setError("This email is not registered with GeoAttend.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <SuccessAnimation message="OTP has been sent successfully." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <button
        type="button"
        className="back-link"
        onClick={() => navigate("/login")}
      >
        <FiArrowLeft /> Back to Login
      </button>

      <h1>Forgot Your Password?</h1>
      <p className="auth-subtitle">
        Enter your registered email address. We'll send you a secure OTP to
        reset your password.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <Input
          icon={<FiMail />}
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          error={error}
          disabled={loading}
          autoComplete="email"
        />

        <motion.button
          type="submit"
          className="forgot-submit-btn"
          disabled={loading}
          whileHover={{ y: loading ? 0 : -3 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <Loader /> Sending OTP...
            </>
          ) : (
            <>
              Send OTP <FiArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <p className="auth-bottom-text">
        Remember your password?{" "}
        <a onClick={() => navigate(`/login?role=${role}`)}>Login</a>
      </p>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fp-toast"
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
