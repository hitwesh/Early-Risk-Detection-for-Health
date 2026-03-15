import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.js";

const Login = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginUser({
        email: formValues.email,
        password: formValues.password,
      });
      navigate("/user");
    } catch (err) {
      setError(err.message ?? "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="fade-in card w-full max-w-md p-8">
        <p className="eyebrow">Secure access</p>
        <h1 className="font-display text-3xl text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your SymptoScan dashboard.
        </p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              value={formValues.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              value={formValues.password}
              onChange={handleChange("password")}
            />
          </div>
          <button className="w-full btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
