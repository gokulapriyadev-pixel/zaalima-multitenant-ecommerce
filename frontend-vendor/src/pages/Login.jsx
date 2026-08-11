import { useState } from "react";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulated login (backend not connected yet)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
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
    <AuthCard title="Vendor Login">
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