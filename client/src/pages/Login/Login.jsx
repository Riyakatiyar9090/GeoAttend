import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import RoleBadge from "../../components/RoleBadge/RoleBadge";
import Loader from "../../components/Loader/Loader";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with real API call, e.g.
      // const res = await axios.post('/api/auth/login', { ...form, role });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigate(
        role === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
      );
    } catch (err) {
      setErrors({ form: "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <RoleBadge role={role} />

      <h1>Welcome Back 👋</h1>
      <p className="auth-subtitle">Sign in to continue to GeoAttend</p>

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
        <Input
          icon={<FiMail />}
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />

        <div className="login-row">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, remember: e.target.checked }))
              }
              disabled={loading}
            />
            Remember me
          </label>
          <a
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </a>
        </div>

        <motion.button
          type="submit"
          className="login-submit-btn"
          disabled={loading}
          whileHover={{ y: loading ? 0 : -3 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <Loader /> Signing In...
            </>
          ) : (
            <>
              Sign In <FiArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <p className="auth-bottom-text">
        Don't have an account?{" "}
        <a onClick={() => navigate("/register")}>Register</a>
      </p>
    </AuthLayout>
  );
}
