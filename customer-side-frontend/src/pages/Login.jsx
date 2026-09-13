import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../redux/authSlice";
import { loginUser } from "../services/api";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");


  // Login button stays disabled until both fields have at least 3 characters
  const isFormValid = formData.email.trim().length >= 3 && formData.password.trim().length >= 3;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if error is present, clear it when user starts typing
    if (error) {
      setError("");
    }
    if (serverError) {
      setServerError("");
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setServerError("");

  if (!formData.email || !formData.password) {
    setError("Please fill in both fields.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  try {
    setIsSubmitting(true);

    const data = await loginUser(
      formData.email,
      formData.password
    );

    dispatch(
      login({
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token,
      })
    );

    navigate("/");
  } catch (err) {
    setServerError(err.message || "Login failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (

    <main className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Login to your Zaalima account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {error && (

            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3">

              <CircleAlert />
              <p className="text-sm font-medium text-red-500">
                {error}
              </p>
            </div>
          )}
          {serverError && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
              <CircleAlert />
              <p className="text-sm font-medium text-red-600">
                {serverError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"

                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-gray-600 hover:text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"

                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-black "
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {/* tabIndex - keeps tab order clean (users tab from password field straight to the submit button, not through the icon).*/}

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>

      </div>
    </main>

  );
}

export default Login;
