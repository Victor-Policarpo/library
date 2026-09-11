export function Loading({ label = "Carregando..." }) {
  return <p className="status">{label}</p>;
}

export function ErrorBox({ message }) {
  return <p className="error">{message}</p>;
}

export function EmptyState({ message }) {
  return <p className="empty">{message}</p>;
}