
import { Link } from "react-router-dom";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend registration API will be connected later
    console.log("Customer registration");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
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

          <form onSubmit={handleSubmit} className="space-y-5">

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
                required
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
                required
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
                required
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
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
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
    </main>
  );
}

export default Register;