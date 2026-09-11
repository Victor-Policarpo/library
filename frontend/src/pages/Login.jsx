import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errors.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (sessionExpired) {
      toast.warning("Sua sessão expirou. Faça login novamente.");
      clearSessionExpired();
    }
  }, [sessionExpired, clearSessionExpired, toast]);

  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state?.registered, navigate, toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || "/libraries";
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Falha no login. Verifique email e senha."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>Biblioteca</h1>
        <p>Entre para acessar o sistema.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-switch">
          Não possui uma conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}