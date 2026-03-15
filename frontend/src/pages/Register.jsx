import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth.js";

const Register = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        email: formValues.email,
        password: formValues.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message ?? "Unable to register.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100 px-6">
      <div className="fade-in w-full max-w-md rounded-xl border border-white/30 bg-white/60 p-8 shadow-xl backdrop-blur-md transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl">
        <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create your SymptoScan account.
        </p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.name}
              onChange={handleChange("name")}
            />
          </div>
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
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
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
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.password}
              onChange={handleChange("password")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
          </div>
          <button
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-in-out hover:scale-105 hover:bg-rose-700 hover:shadow-lg active:scale-95"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-medium text-rose-600 hover:text-rose-700"
            to="/login"
          >
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
