
import { Link } from "react-router-dom";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend login API will be connected later
    console.log("Customer login");
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
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

          <form onSubmit={handleSubmit} className="space-y-5">

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

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
            >
              Login
            </button>

          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
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
