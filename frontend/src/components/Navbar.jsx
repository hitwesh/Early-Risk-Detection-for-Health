import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, getToken, logoutUser } from "../services/auth.js";

const Navbar = () => {
  const baseClass = "nav-link";
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getToken());
  const userEmail = localStorage.getItem("userEmail");
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated) {
        setUserRole("user");
        return;
      }

      try {
        const user = await getCurrentUser();
        if (user?.email) {
          localStorage.setItem("userEmail", user.email);
        }
        setUserRole(user?.role ?? "user");
      } catch (err) {
        setUserRole("user");
      }
    };

    loadUser();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `${baseClass}${isActive ? " active" : ""}`;

  return (
    <nav className="nav-shell px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="mr-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-900 text-white">
              S
            </span>
            <span className="font-display">SymptoScan</span>
          </span>
          <NavLink className={navLinkClass} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClass} to="/diagnosis">
            Diagnosis
          </NavLink>
          <NavLink className={navLinkClass} to="/user">
            Patient Portal
          </NavLink>
          {isAuthenticated && userRole === "admin" && (
            <NavLink className={navLinkClass} to="/admin">
              Admin
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-semibold text-slate-700">
                {userEmail ?? "Account"}
              </span>
              <button
                className="btn-secondary"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={navLinkClass} to="/login">
                Login
              </NavLink>
              <NavLink className={navLinkClass} to="/register">
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
