import { useState } from "react";
import { ErrorBox } from "../../components/ui/Feedback.jsx";
import { libraryService } from "../../services/libraryService.js";
import { getErrorMessage } from "../../utils/errors.js";

export default function LibraryForm({ library = null, onCancel, onSaved }) {
  const isEditing = Boolean(library);

  const [form, setForm] = useState(
    library ? { name: library.name, address: library.address } : { name: "", address: "" }
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      setError("Preencha nome e endereço.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = { name: form.name.trim(), address: form.address.trim() };
      if (isEditing) {
        await libraryService.update(library.id, payload);
        onSaved("Biblioteca atualizada com sucesso.");
      } else {
        await libraryService.create(payload);
        onSaved("Biblioteca criada com sucesso.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao salvar biblioteca."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>{isEditing ? "Editar Biblioteca" : "Nova Biblioteca"}</h2>

      {error && <ErrorBox message={error} />}

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
        Endereço
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}