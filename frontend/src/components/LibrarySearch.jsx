import { useMemo, useState } from "react";
import { useLibraries } from "../hooks/useLibraries.js";
import { getErrorMessage } from "../utils/errors.js";
import { EmptyState, ErrorBox, Loading } from "./ui/Feedback.jsx";

/**
 * Props:
 *  - value: id da biblioteca atualmente selecionada (ou null)
 *  - onSelect: callback recebendo o objeto Library selecionado (ou null ao limpar)
 */
export default function LibrarySearch({ value, onSelect }) {
  const { libraries, loading, error } = useLibraries();
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => libraries.find((library) => library.id === Number(value)) || null,
    [libraries, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return libraries
      .filter((library) => library.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [libraries, query]);

  const handleChoose = (library) => {
    setQuery("");
    onSelect(library);
  };

  if (selected) {
    return (
      <div className="library-search">
        <p className="field-hint">Biblioteca selecionada:</p>
        <div className="library-selected">
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.address}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setQuery("");
              onSelect(null);
            }}
          >
            Alterar
          </button>
        </div>
      </div>
    );
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div className="library-search">
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Digite o nome da biblioteca..."
        autoComplete="off"
      />

      {loading && <Loading label="Carregando bibliotecas..." />}
      {error && <ErrorBox message={getErrorMessage(error, "Falha ao carregar bibliotecas.")} />}

      {!loading && !error && filtered.length > 0 && (
        <ul className="library-search-results">
          {filtered.map((library) => (
            <li key={library.id}>
              <button
                type="button"
                className="search-result"
                onClick={() => handleChoose(library)}
              >
                <strong>{library.name}</strong>
                <span>{library.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && hasQuery && filtered.length === 0 && (
        <EmptyState message="Nenhuma biblioteca encontrada com esse nome." />
      )}

      {!loading && !error && !hasQuery && (
        <p className="field-hint">
          {libraries.length > 0
            ? "Digite para buscar uma biblioteca."
            : "Nenhuma biblioteca cadastrada. Crie uma biblioteca primeiro."}
        </p>
      )}
    </div>
  );
}