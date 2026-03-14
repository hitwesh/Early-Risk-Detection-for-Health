import { NavLink, useNavigate } from "react-router-dom";
import { getToken, logoutUser } from "../services/auth.js";

const Navbar = () => {
  const baseClass =
    "mr-4 rounded-full px-3 py-1 text-sm font-medium text-rose-900 hover:bg-rose-100";
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getToken());

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="border-b border-rose-100 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
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
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              className="rounded-full px-3 py-1 text-sm font-medium text-rose-900 hover:bg-rose-100"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink className={baseClass} to="/login">
                Login
              </NavLink>
              <NavLink
                className="rounded-full px-3 py-1 text-sm font-medium text-rose-900 hover:bg-rose-100"
                to="/register"
              >
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
