import { login } from "../redux/authSlice";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
    }
    if (serverError) {
      setServerError("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }


    setError("");
    setIsSubmitting(true);

    try {
      // 4. Hit the backend
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'customer' 
      });

      // 5. Save to local storage
      localStorage.setItem('customerToken', response.data.token);
      localStorage.setItem('customerInfo', JSON.stringify(response.data));

      // 6. TELL REDUX YOU ARE LOGGED IN
      dispatch(login({
        user: response.data,
        token: response.data.token
      }));

      setIsSubmitting(false);
      navigate('/'); 
      
    } catch (error) {
      setIsSubmitting(false);
      setServerError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] bg-gray-50 ">
      {/* left side */}
      <div className="relative hidden w-1/2 items-center overflow-hidden bg-linear-to-br from-[#0B1F1C] via-[#0F2C27] to-black lg:flex">
        {/* decorative circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#C9A227]/10" />
          <div className="absolute right-16 top-20 h-32 w-32 rounded-full bg-[#C9A227]/10" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-[#C9A227]/15" />
          <div className="absolute -bottom-32 left-16 h-72 w-72 rounded-full bg-[#C9A227]/10" />
        </div>
        <div
          className="pointer-events-none absolute inset-0  opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffe599 1px, #000000 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* content on top of the shapes */}
        <div className="relative z-10 px-16">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Welcome to Zaalima
          </h1>
          <p className="mt-2 text-lg font-semibold uppercase tracking-wide text-[#D9B968]">
            Your one-stop shop for everything you love
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            Create your account and start shopping with us. Enjoy exclusive
            deals, faster checkout, and order tracking — all in one place.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Create your customer account to start shopping
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            {(error || serverError) && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <CircleAlert size={18} className="shrink-0 text-red-500" />
                <p className="text-sm font-medium text-red-600">
                  {error || serverError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}

                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] cursor-pointer6"
              >
                Create Account
              </button>

            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-black hover:underline"
              >
                Login
              </Link>
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}

export default Register;