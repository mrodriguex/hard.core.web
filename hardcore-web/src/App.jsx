import { useState } from "react";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import Menus from "./pages/Menus";
import Clientes from "./pages/Clientes";
import Perfiles from "./pages/Perfiles";
import Usuarios from "./pages/Usuarios";
import Navbar from "./components/Navbar";
import { logout } from "./services/authService";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("empresas");

  function handleLogout() {
    logout();
    setLoggedIn(false);
    setPage("empresas");
  }

  if (!loggedIn) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar page={page} onNavigate={setPage} onLogout={handleLogout} />
      {page === "empresas" && <Empresas />}
      {page === "menus"    && <Menus />}
      {page === "clientes" && <Clientes />}
      {page === "perfiles" && <Perfiles />}
      {page === "usuarios" && <Usuarios />}
    </div>
  );
}

export default App;