import { NavLink } from "react-router-dom";

const Navbar = () => {
  const baseClass =
    "mr-4 rounded-full px-3 py-1 text-sm font-medium text-rose-900 hover:bg-rose-100";

  return (
    <nav className="border-b border-rose-100 bg-white/80 px-6 py-4 backdrop-blur">
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
    </nav>
  );
};

export default Navbar;
