import { NavLink, useNavigate } from "react-router-dom";
import { getToken, logoutUser } from "../services/auth.js";

const Navbar = () => {
  const baseClass =
    "rounded-full px-3 py-1 text-sm font-medium text-rose-900 transition duration-200 hover:bg-rose-100 hover:text-rose-600";
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getToken());
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="border-b border-white/30 bg-white/60 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="mr-6 text-lg font-semibold text-rose-900">
            SymptoScan
          </span>
          <NavLink className={baseClass} to="/">
            Home
          </NavLink>
          <NavLink className={baseClass} to="/diagnosis">
            Diagnosis
          </NavLink>
          <NavLink className={baseClass} to="/dashboard">
            Dashboard
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-rose-900">
                {userEmail ?? "Account"}
              </span>
              <button
                className="rounded-full px-3 py-1 text-sm font-medium text-rose-900 transition duration-200 hover:bg-rose-100 hover:text-rose-600"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={baseClass} to="/login">
                Login
              </NavLink>
              <NavLink className={baseClass} to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
