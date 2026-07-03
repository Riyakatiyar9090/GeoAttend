import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiArrowRight,
  FiHash,
  FiBookOpen,
  FiBriefcase,
  FiLayers,
  FiAward,
} from "react-icons/fi";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import RoleBadge from "../../components/RoleBadge/RoleBadge";
import Loader from "../../components/Loader/Loader";
import PasswordStrength, {
  getPasswordScore,
} from "../../components/PasswordStrength/PasswordStrength";
import "./Register.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  rollNumber: "",
  branch: "",
  year: "",
  employeeId: "",
  department: "",
  designation: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (getPasswordScore(form.password) <= 2)
      newErrors.password = "Password is too weak";

    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (role === "student") {
      if (!form.rollNumber.trim())
        newErrors.rollNumber = "Roll number is required";
      if (!form.branch.trim()) newErrors.branch = "Branch is required";
      if (!form.year.trim()) newErrors.year = "Year/Semester is required";
    } else {
      if (!form.employeeId.trim())
        newErrors.employeeId = "Employee ID is required";
      if (!form.department.trim())
        newErrors.department = "Department is required";
      if (!form.designation.trim())
        newErrors.designation = "Designation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must accept the Terms & Conditions",
      }));
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with real API call, e.g.
      // await axios.post('/api/auth/register', { ...form, role });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigate("/verify-otp", {
        state: { email: form.email, role, name: form.name },
      });
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="register-role-row">
        <RoleBadge role={role} />
        <button
          type="button"
          className="change-role-btn"
          onClick={() => navigate("/select-role")}
        >
          Change Role
        </button>
      </div>

      <h1>Create Your Account</h1>
      <p className="auth-subtitle">
        Join GeoAttend and start managing attendance smarter.
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
        <Input
          icon={<FiUser />}
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          disabled={loading}
          autoComplete="name"
        />

        <Input
          icon={<FiMail />}
          label="College Email Address"
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
        <PasswordStrength password={form.password} />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
        />

        {role === "student" ? (
          <motion.div
            className="role-fields"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Input
              icon={<FiHash />}
              label="Roll Number"
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              error={errors.rollNumber}
              disabled={loading}
            />
            <Input
              icon={<FiBookOpen />}
              label="Branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              error={errors.branch}
              disabled={loading}
            />
            <Input
              icon={<FiLayers />}
              label="Year / Semester"
              name="year"
              value={form.year}
              onChange={handleChange}
              error={errors.year}
              disabled={loading}
            />
          </motion.div>
        ) : (
          <motion.div
            className="role-fields"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Input
              icon={<FiHash />}
              label="Employee ID"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              error={errors.employeeId}
              disabled={loading}
            />
            <Input
              icon={<FiBriefcase />}
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
              disabled={loading}
            />
            <Input
              icon={<FiAward />}
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              error={errors.designation}
              disabled={loading}
            />
          </motion.div>
        )}

        <label className="terms-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
            }}
            disabled={loading}
          />
          I agree to the <a href="/terms">Terms & Conditions</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </label>
        {errors.terms && <p className="input-error-text">{errors.terms}</p>}

        <motion.button
          type="submit"
          className="register-submit-btn"
          disabled={loading || !agreed}
          whileHover={{ y: loading || !agreed ? 0 : -3 }}
          whileTap={{ scale: loading || !agreed ? 1 : 0.97 }}
        >
          {loading ? (
            <>
              <Loader /> Creating Account...
            </>
          ) : (
            <>
              Create Account <FiArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <p className="auth-bottom-text">
        Already have an account?{" "}
        <a onClick={() => navigate(`/login?role=${role}`)}>Login</a>
      </p>
    </AuthLayout>
  );
}
