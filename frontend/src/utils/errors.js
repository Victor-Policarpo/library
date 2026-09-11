export function getErrorMessage(
  error,
  fallback = "Algo deu errado. Tente novamente."
) {
  const message = error?.response?.data?.message;
  if (message) return message;
  if (error?.message) return error.message;
  return fallback;
}