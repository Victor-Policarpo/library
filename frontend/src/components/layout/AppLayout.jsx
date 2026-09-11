import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="navbar">
        <span className="navbar-brand">Biblioteca</span>
        <nav className="navbar-links">
          <NavLink to="/libraries">Bibliotecas</NavLink>
          <NavLink to="/books">Livros</NavLink>
          <NavLink to="/profile">Meu perfil</NavLink>
        </nav>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Sair
        </button>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}