import { useState } from "react";
import { ErrorBox } from "../../components/ui/Feedback.jsx";
import { bookService } from "../../services/bookService.js";
import { getErrorMessage } from "../../utils/errors.js";
import BookForm from "./BookForm.jsx";
import BookList from "./BookList.jsx";

export default function BooksPage() {
  const [mode, setMode] = useState("list");
  const [editingBook, setEditingBook] = useState(null);
  const [notice, setNotice] = useState("");
  const [listKey, setListKey] = useState(0);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditingBook(null);
    setMode("create");
    setNotice("");
    setError("");
  };

  const openEdit = (book) => {
    setEditingBook(book);
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
    if (!window.confirm("Excluir este livro?")) {
      return;
    }
    setError("");
    try {
      await bookService.remove(id);
      setNotice("Livro excluído com sucesso.");
      setListKey((key) => key + 1);
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao excluir livro."));
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

      {notice && <div className="notice">{notice}</div>}
      {error && <ErrorBox message={error} />}

      <BookList key={listKey} onEdit={openEdit} onDelete={handleDelete} />
    </div>
  );
}