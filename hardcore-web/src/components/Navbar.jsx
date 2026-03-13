const NAV_ITEMS = [
  { key: "empresas", label: "Empresas" },
  { key: "menus",    label: "Menús"    },
  { key: "clientes", label: "Clientes" },
  { key: "perfiles", label: "Perfiles" },
  { key: "usuarios", label: "Usuarios" },
];

export default function Navbar({ page, onNavigate, onLogout }) {
  return (
    <header className="bg-blue-700 text-white px-6 py-0 flex items-center justify-between shadow-md">
      {/* Brand */}
      <span className="text-lg font-bold tracking-widest py-4 mr-8 select-none">
        HARDCORE
      </span>

      {/* Nav links */}
      <nav className="flex items-stretch flex-1 gap-1">
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={`px-5 py-4 text-sm font-semibold transition-colors border-b-2 ${
              page === key
                ? "border-white text-white"
                : "border-transparent text-blue-200 hover:text-white hover:border-blue-300"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="bg-white text-blue-700 px-4 py-1.5 rounded font-semibold hover:bg-blue-50 transition-colors text-sm"
      >
        Cerrar Sesión
      </button>
    </header>
  );
}
