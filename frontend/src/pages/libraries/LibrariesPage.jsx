import { useState } from "react";
import { ErrorBox } from "../../components/ui/Feedback.jsx";
import { libraryService } from "../../services/libraryService.js";
import { getErrorMessage } from "../../utils/errors.js";
import LibraryForm from "./LibraryForm.jsx";
import LibraryList from "./LibraryList.jsx";

export default function LibrariesPage() {
  const [mode, setMode] = useState("list");
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [notice, setNotice] = useState("");
  const [listKey, setListKey] = useState(0);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditingLibrary(null);
    setMode("create");
    setNotice("");
    setError("");
  };

  const openEdit = (library) => {
    setEditingLibrary(library);
    setMode("edit");
    setNotice("");
    setError("");
  };

  const handleSaved = (message) => {
    setNotice(message);
    setMode("list");
    setListKey((key) => key + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir esta biblioteca? Todos os livros vinculados também serão excluídos.")) {
      return;
    }
    setError("");
    try {
      await libraryService.remove(id);
      setNotice("Biblioteca excluída com sucesso.");
      setListKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao excluir biblioteca."));
    }
  };

  if (mode === "create" || mode === "edit") {
    return (
      <div className="page">
        <LibraryForm
          key={editingLibrary?.id ?? "new"}
          library={editingLibrary}
          onCancel={() => setMode("list")}
          onSaved={handleSaved}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bibliotecas</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Nova Biblioteca
        </button>
      </div>

      {notice && <div className="notice">{notice}</div>}
      {error && <ErrorBox message={error} />}

      <LibraryList key={listKey} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}