import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors = {};
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
      const response = await api.post('/auth/login', { email, password });

      // Guardrail: Kick out standard customers
      if (response.data.role === 'customer') {
        setApiError("Access denied. Customers cannot log into this portal.");
        setLoading(false);
        return;
      }

      localStorage.setItem('vendorToken', response.data.token);
      localStorage.setItem('vendorInfo', JSON.stringify(response.data));

      setLoading(false);
      setSuccess(true);

      const isSuperAdmin = response.data.role === 'super_admin' || response.data.role === 'superadmin';
      setTimeout(() => {
        if (isSuperAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (error) {
      setLoading(false);
      setApiError(error.response?.data?.message || "Invalid email or password.");
    }
  };

  if (success) {
    return (
      <AuthCard title="Welcome back!">
        <p className="text-center text-gray-600 mb-4">
          You've successfully logged in as <span className="font-medium">{email}</span>.
        </p>
        <Button variant="secondary" onClick={() => setSuccess(false)}>
          Back to login
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Merchant Login">
      {apiError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
          {apiError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default Login;