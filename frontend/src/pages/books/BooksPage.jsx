import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { bookService } from "../../services/bookService.js";
import { getErrorMessage } from "../../utils/errors.js";
import BookForm from "./BookForm.jsx";
import BookList from "./BookList.jsx";

export default function BooksPage() {
  const [mode, setMode] = useState("list");
  const [editingBook, setEditingBook] = useState(null);
  const [listKey, setListKey] = useState(0);

  const toast = useToast();

  const openCreate = () => {
    setEditingBook(null);
    setMode("create");
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setMode("edit");
  };

  const handleSaved = (message) => {
    toast.success(message);
    setMode("list");
    setListKey((key) => key + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este livro?")) {
      return;
    }
    try {
      await bookService.remove(id);
      toast.success("Livro excluído com sucesso.");
      setListKey((key) => key + 1);
    } catch (err) {
      toast.error(getErrorMessage(err, "Falha ao excluir livro."));
    }
  };

  if (mode === "create" || mode === "edit") {
    return (
      <div className="page">
        <BookForm
          key={editingBook?.id ?? "new"}
          book={editingBook}
          onCancel={() => setMode("list")}
          onSaved={handleSaved}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Livros</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Novo Livro
        </button>
      </div>

      <BookList key={listKey} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}