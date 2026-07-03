import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiX } from "react-icons/fi";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import PasswordStrength, {
  getPasswordScore,
} from "../../components/PasswordStrength/PasswordStrength";
import Loader from "../../components/Loader/Loader";
import SuccessAnimation from "../../components/SuccessAnimation/SuccessAnimation";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "", role = "student" } = location.state || {};

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect away if someone lands here without a verified email/role context
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (errors.form) setErrors((prev) => ({ ...prev, form: "" }));
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const validate = () => {
    const newErrors = {};

    if (!form.password.trim()) newErrors.password = "New password is required";
    else if (getPasswordScore(form.password) <= 2)
      newErrors.password = "Password is too weak";

    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your new password";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with real API call, e.g.
      // await axios.post('/api/auth/reset-password', { email, password: form.password });
      await new Promise((resolve, reject) =>
        setTimeout(
          () =>
            email === "expired@geoattend.com"
              ? reject(new Error("expired"))
              : resolve(),
          1200,
        ),
      );

      setSuccess(true);
      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 2200);
    } catch (err) {
      setErrors({
        form:
          err?.message === "expired"
            ? "This reset link has expired. Please request a new one."
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !form.password ||
    !form.confirmPassword ||
    getPasswordScore(form.password) <= 2 ||
    !passwordsMatch;

  if (success) {
    return (
      <AuthLayout>
        <SuccessAnimation message="Password Updated Successfully" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1>Create New Password</h1>
      <p className="auth-subtitle">
        Choose a strong password to secure your GeoAttend account.
      </p>

      {errors.form && (
        <motion.div
          className="form-error-banner"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
        >
          {errors.form}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <PasswordInput
          label="New Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />
        <PasswordStrength password={form.password} />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
        />

        <AnimatePresence>
          {form.confirmPassword.length > 0 && (
            <motion.p
              className={`match-indicator ${passwordsMatch ? "match-yes" : "match-no"}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {passwordsMatch ? <FiCheck /> : <FiX />}
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          className="reset-submit-btn"
          disabled={isDisabled}
          whileHover={{ y: isDisabled ? 0 : -3 }}
          whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <Loader /> Updating Password...
            </>
          ) : (
            <>
              Reset Password <FiArrowRight />
            </>
          )}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
