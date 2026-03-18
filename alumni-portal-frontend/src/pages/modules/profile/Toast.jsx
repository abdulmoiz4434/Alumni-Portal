import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
};

export function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <span className="toast-icon">{ICONS[toast.type]}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
            <motion.div
              className="toast-progress"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}