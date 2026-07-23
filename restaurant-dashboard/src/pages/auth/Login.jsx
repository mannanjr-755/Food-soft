import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    // Simulate brief auth latency for UX
    await new Promise((r) => setTimeout(r, 400));

    const result = login(email, password, remember);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    toast.success(`Welcome back, ${result.user.name}`);
    const redirectTo =
      location.state?.from && location.state.from !== "/admin/login"
        ? location.state.from
        : "/admin/dashboard";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-2xl font-bold text-white">
            R
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Restaurant Admin
        </h1>
        <p className="mb-6 mt-2 text-center text-gray-500">
          Sign in to manage your restaurant
        </p>

        {error ? (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@restaurant.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-transparent focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300"
              />
              Remember me
            </label>
            <span className="text-sm text-gray-400">Demo: admin123</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-semibold text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-gray-500">
          <p className="font-medium text-gray-700">Demo credentials</p>
          <p className="mt-1">Admin: admin@restaurant.com / admin123</p>
          <p>Manager: ali@restaurant.com / manager123</p>
          <p className="mt-1 text-amber-700">
            Cashier accounts are denied admin access.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          © 2026 Restaurant Admin • Version 1.0
        </div>
      </div>
    </div>
  );
}
