import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!storeName.trim()) {
      newErrors.storeName = "Store name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      // 1. Send the real request to the backend
      const response = await api.post('/auth/register', {
        name: storeName,
        email: email,
        password: password,
        role: 'vendor' // Crucial: forces the vendor role
      });

      // 2. Save the token and user info
      localStorage.setItem('vendorToken', response.data.token);
      localStorage.setItem('vendorInfo', JSON.stringify(response.data));

      setLoading(false);
      setSuccess(true);

      // 3. Send them to the dashboard automatically after a brief pause
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      setLoading(false);
      // Grab the specific error message your Express backend threw
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <AuthCard title="Account created!">
        <p className="text-center text-gray-600 mb-4">
          Welcome, <span className="font-medium">{storeName}</span>. Your vendor account is ready.
        </p>
        <Button variant="secondary" onClick={() => setSuccess(false)}>
          Back to registration
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Vendor Registration">
      {apiError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
          {apiError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="Store name"
          type="text"
          placeholder="Your store name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          error={errors.storeName}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default Register;