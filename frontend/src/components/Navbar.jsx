import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, getToken, logoutUser } from "../services/auth.js";

const Navbar = () => {
  const baseClass =
    "rounded-full px-3 py-1 text-sm font-medium text-rose-900 transition duration-200 hover:bg-rose-100 hover:text-rose-600";
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
          <NavLink className={baseClass} to="/user">
            User Panel
          </NavLink>
          {isAuthenticated && userRole === "admin" && (
            <NavLink className={baseClass} to="/admin">
              Admin
            </NavLink>
          )}
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
