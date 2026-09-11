import { useMemo, useState } from "react";
import { EmptyState, ErrorBox, Loading } from "../../components/ui/Feedback.jsx";
import { useBooks } from "../../hooks/useBooks.js";
import { useLibraries } from "../../hooks/useLibraries.js";
import { getErrorMessage } from "../../utils/errors.js";

export default function BookList({ onEdit, onDelete }) {
  const { books, loading, error } = useBooks();
  const { libraries } = useLibraries();
  const [libraryFilter, setLibraryFilter] = useState("");

  const filteredBooks = useMemo(() => {
    if (!libraryFilter) return books;
    return books.filter((book) => book.library_id === Number(libraryFilter));
  }, [books, libraryFilter]);

  if (loading) {
    return <Loading label="Carregando livros..." />;
  }

  if (error) {
    return <ErrorBox message={getErrorMessage(error, "Falha ao carregar livros.")} />;
  }

  if (books.length === 0) {
    return <EmptyState message="Nenhum livro cadastrado ainda." />;
  }

  return (
    <>
      {libraries.length > 0 && (
        <div className="list-filter">
          <label>
            Filtrar por biblioteca
            <select
              value={libraryFilter}
              onChange={(event) => setLibraryFilter(event.target.value)}
            >
              <option value="">Todas</option>
              {libraries.map((library) => (
                <option key={library.id} value={library.id}>
                  {library.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Ano</th>
              <th>Biblioteca</th>
              <th className="actions-col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publication_year ?? "—"}</td>
                <td>{book.library_name}</td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onEdit(book)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onDelete(book.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBooks.length === 0 && (
        <EmptyState message="Nenhum livro encontrado para essa biblioteca." />
      )}
    </>
  );
}