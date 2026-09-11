import { useLibraries } from "../../hooks/useLibraries.js";
import { getErrorMessage } from "../../utils/errors.js";
import { EmptyState, ErrorBox, Loading } from "../../components/ui/Feedback.jsx";

export default function LibraryList({ onEdit, onDelete }) {
  const { libraries, loading, error } = useLibraries();

  if (loading) {
    return <Loading label="Carregando bibliotecas..." />;
  }

  if (error) {
    return <ErrorBox message={getErrorMessage(error, "Falha ao carregar bibliotecas.")} />;
  }

  if (libraries.length === 0) {
    return <EmptyState message="Nenhuma biblioteca cadastrada ainda." />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Endereço</th>
            <th className="actions-col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {libraries.map((library) => (
            <tr key={library.id}>
              <td>{library.id}</td>
              <td>{library.name}</td>
              <td>{library.address}</td>
              <td>
                <div className="actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onEdit(library)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(library.id)}
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
  );
}