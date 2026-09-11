import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { libraryService } from "../../services/libraryService.js";
import { getErrorMessage } from "../../utils/errors.js";
import LibraryForm from "./LibraryForm.jsx";
import LibraryList from "./LibraryList.jsx";

export default function LibrariesPage() {
  const [mode, setMode] = useState("list");
  const [editingLibrary, setEditingLibrary] = useState(null);
  const [listKey, setListKey] = useState(0);

  const toast = useToast();

  const openCreate = () => {
    setEditingLibrary(null);
    setMode("create");
  };

  const openEdit = (library) => {
    setEditingLibrary(library);
    setMode("edit");
  };

  const handleSaved = (message) => {
    toast.success(message);
    setMode("list");
    setListKey((key) => key + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir esta biblioteca? Todos os livros vinculados também serão excluídos.")) {
      return;
    }
    try {
      await libraryService.remove(id);
      toast.success("Biblioteca excluída com sucesso.");
      setListKey((key) => key + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Falha ao excluir biblioteca."));
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

      <LibraryList key={listKey} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}