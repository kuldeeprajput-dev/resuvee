import { create } from "zustand";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "emerald";
  onConfirm: () => void;
}

interface NotificationState {
  toasts: ToastMessage[];
  confirmDialog: ConfirmDialogOptions | null;
  showToast: (title: string, message?: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  showConfirm: (options: ConfirmDialogOptions) => void;
  closeConfirm: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  toasts: [],
  confirmDialog: null,

  showToast: (title, message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, title, message, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  showConfirm: (options) => {
    set({ confirmDialog: options });
  },

  closeConfirm: () => {
    set({ confirmDialog: null });
  },
}));
