import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import Menus from "./pages/Menus";
import Clientes from "./pages/Clientes";
import Perfiles from "./pages/Perfiles";
import Usuarios from "./pages/Usuarios";
import Mensajes from "./pages/Mensajes";
import Navbar from "./components/Navbar";
import ApkDownloadButton from "./components/ApkDownloadButton";
import { isAuthenticated, logout } from "./services/authService";
import { startDataHub, stopDataHub } from "./services/signalrService";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [page, setPage] = useState("empresas");
  const [hubMessage, setHubMessage] = useState("");

  useEffect(() => {
    if (!loggedIn) return;

    let conn;

    (async () => {
      try {
        conn = await startDataHub();

        conn.off("ReceiveUpdate");
        conn.off("ReceiveMessage");

        conn.on("ReceiveUpdate", () => {
          window.dispatchEvent(new CustomEvent("datahub:update"));
        });

        conn.on("ReceiveMessage", (message) => {
          setHubMessage(message || "Nuevo mensaje");
        });
      } catch (error) {
        console.error("SignalR error:", error);
      }
    })();

    return () => {
      if (conn) {
        conn.off("ReceiveUpdate");
        conn.off("ReceiveMessage");
      }
      stopDataHub();
    };
  }, [loggedIn]);

  function handleLogout() {
    logout();
    stopDataHub(); // explicit stop on manual logout
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
      {page === "mensajes" && <Mensajes />}
      <ApkDownloadButton />
      {hubMessage && <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-2 text-center">
        {hubMessage}
      </div>}
    </div>
  );
}

export default App;