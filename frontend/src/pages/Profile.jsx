import { useEffect, useState } from "react";
import { ErrorBox, Loading } from "../components/ui/Feedback.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { userService } from "../services/userService.js";
import { getErrorMessage } from "../utils/errors.js";
import { decodeToken } from "../utils/jwt.js";

export default function Profile() {
  const { token } = useAuth();
  const userId = decodeToken(token)?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [form, setForm] = useState({ name: "", email: "" });
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let canceled = false;

    async function loadUser() {
      if (!userId) {
        setFetchError("Não foi possível identificar o usuário. Faça login novamente.");
        setLoading(false);
        return;
      }
      try {
        const data = await userService.getById(userId);
        if (!canceled) {
          setUser(data);
          setForm({ name: data.name || "", email: data.email || "" });
        }
      } catch (err) {
        if (!canceled) {
          setFetchError(getErrorMessage(err, "Falha ao carregar seus dados."));
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    loadUser();
    return () => {
      canceled = true;
    };
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setSaveError("Preencha nome e email.");
      return;
    }
    setSaving(true);
    setSaveError("");
    setNotice("");
    try {
      await userService.update(userId, {
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setNotice("Dados atualizados com sucesso.");
    } catch (err) {
      setSaveError(getErrorMessage(err, "Falha ao atualizar seus dados."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading label="Carregando perfil..." />;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Meu perfil</h1>
      </div>

      {fetchError && <ErrorBox message={fetchError} />}

      {user && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <p className="field-hint">
            Edite os campos permitidos pela API (senha não pode ser alterada por aqui).
          </p>

          {notice && <div className="notice">{notice}</div>}
          {saveError && <ErrorBox message={saveError} />}

          <label>
            Nome
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}