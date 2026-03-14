import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.message ?? "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your SymptoScan dashboard.
        </p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-300 focus:outline-none"
              value={formValues.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-300 focus:outline-none"
              value={formValues.password}
              onChange={handleChange("password")}
            />
          </div>
          <button
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
