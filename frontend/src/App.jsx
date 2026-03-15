import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Diagnosis from "./pages/Diagnosis.jsx";
import Results from "./pages/Results.jsx";
import UserPanel from "./pages/UserPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {
  return (
    <div className="app-shell text-slate-900">
      <Navbar />
      <main className="page-wrapper">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
