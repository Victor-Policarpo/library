import { useState } from "react";
import LibrarySearch from "../../components/LibrarySearch.jsx";
import { ErrorBox } from "../../components/ui/Feedback.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { bookService } from "../../services/bookService.js";
import { getErrorMessage } from "../../utils/errors.js";

export default function BookForm({ book = null, onCancel, onSaved }) {
  const isEditing = Boolean(book);

  const [form, setForm] = useState(
    book
      ? {
          title: book.title,
          author: book.author,
          publicationYear:
            book.publication_year == null ? "" : String(book.publication_year),
        }
      : { title: "", author: "", publicationYear: "" }
  );
  const [libraryId, setLibraryId] = useState(book ? Number(book.library_id) : null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSelectLibrary = (library) => {
    setLibraryId(library ? library.id : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim()) {
      setError("Preencha título e autor.");
      return;
    }
    if (!libraryId) {
      setError("Selecione uma biblioteca.");
      return;
    }

    const year = form.publicationYear.trim();
    if (year !== "" && (isNaN(Number(year)) || Number(year) <= 0)) {
      setError("Informe um ano de publicação válido.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        publication_year: year === "" ? null : Number(year),
        library_id: libraryId,
      };

      if (isEditing) {
        await bookService.update(book.id, payload);
        onSaved("Livro atualizado com sucesso.");
      } else {
        await bookService.create(payload);
        onSaved("Livro criado com sucesso.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Falha ao salvar livro."));
      setError("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>{isEditing ? "Editar Livro" : "Novo Livro"}</h2>
      <p className="field-hint">
        Um livro pertence a uma biblioteca (relação 1:N).
      </p>

      {error && <ErrorBox message={error} />}

      <label>
        Título
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Autor
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Ano de publicação{" "}
        <span className="hint-inline">(opcional)</span>
        <input
          type="number"
          name="publicationYear"
          value={form.publicationYear}
          onChange={handleChange}
          min="0"
          placeholder="Ex.: 2001"
        />
      </label>

      <div className="search-field">
        <LibrarySearch value={libraryId} onSelect={handleSelectLibrary} />
      </div>

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