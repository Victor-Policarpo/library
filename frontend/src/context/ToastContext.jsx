import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;
const MAX_STACK = 5;

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
};

function ToastItem({ toast, onDismiss }) {
  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span className="toast-icon" aria-hidden="true">
        {ICONS[toast.type] || ICONS.info}
      </span>
      <p className="toast-message">{toast.message}</p>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const idCounter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (type, message, options = {}) => {
      const duration = options.duration || DEFAULT_DURATION;
      idCounter.current += 1;
      const id = idCounter.current;

      setToasts((current) => {
        const next = [...current, { id, type, message }];
        return next.length > MAX_STACK ? next.slice(next.length - MAX_STACK) : next;
      });

      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  const success = useCallback((message, options) => show("success", message, options), [show]);
  const info = useCallback((message, options) => show("info", message, options), [show]);
  const warning = useCallback((message, options) => show("warning", message, options), [show]);
  const error = useCallback((message, options) => show("error", message, options), [show]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ success, info, warning, error, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}