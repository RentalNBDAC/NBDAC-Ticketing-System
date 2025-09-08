import { toast as sonnerToast } from 'sonner@2.0.3';

// Type definitions for flexible toast parameters
type ToastOptions = {
  description?: string;
} | string;

// Helper function to extract description from flexible parameters
const getDescription = (messageOrOptions?: ToastOptions): string | undefined => {
  if (typeof messageOrOptions === 'string') {
    return messageOrOptions;
  }
  if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
    return messageOrOptions.description;
  }
  return undefined;
};

export const toast = {
  success: (title: string, messageOrOptions?: ToastOptions, persistent = false) => {
    const description = getDescription(messageOrOptions);
    sonnerToast.success(title, {
      description,
      duration: persistent ? Infinity : 4000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(16, 185, 129, 0.05)',
        backdropFilter: 'blur(16px)',
        minHeight: '64px',
        maxWidth: '400px',
      },
      classNames: {
        title: 'text-white font-semibold text-sm leading-5',
        description: 'text-white/95 text-sm leading-5 mt-1',
        icon: 'text-white w-5 h-5',
        closeButton: 'text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg',
      },
    });
  },

  error: (title: string, messageOrOptions?: ToastOptions, persistent = true) => {
    const description = getDescription(messageOrOptions);
    sonnerToast.error(title, {
      description,
      duration: persistent ? Infinity : 6000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(220, 38, 38, 0.05)',
        backdropFilter: 'blur(16px)',
        minHeight: '64px',
        maxWidth: '400px',
      },
      classNames: {
        title: 'text-white font-semibold text-sm leading-5',
        description: 'text-white/95 text-sm leading-5 mt-1',
        icon: 'text-white w-5 h-5',
        closeButton: 'text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg',
      },
    });
  },

  info: (title: string, messageOrOptions?: ToastOptions, persistent = false) => {
    const description = getDescription(messageOrOptions);
    sonnerToast.info(title, {
      description,
      duration: persistent ? Infinity : 4000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05)',
        backdropFilter: 'blur(16px)',
        minHeight: '64px',
        maxWidth: '400px',
      },
      classNames: {
        title: 'text-white font-semibold text-sm leading-5',
        description: 'text-white/95 text-sm leading-5 mt-1',
        icon: 'text-white w-5 h-5',
        closeButton: 'text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg',
      },
    });
  },

  warning: (title: string, messageOrOptions?: ToastOptions, persistent = false) => {
    const description = getDescription(messageOrOptions);
    sonnerToast.warning(title, {
      description,
      duration: persistent ? Infinity : 5000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(245, 158, 11, 0.05)',
        backdropFilter: 'blur(16px)',
        minHeight: '64px',
        maxWidth: '400px',
      },
      classNames: {
        title: 'text-white font-semibold text-sm leading-5',
        description: 'text-white/95 text-sm leading-5 mt-1',
        icon: 'text-white w-5 h-5',
        closeButton: 'text-white/80 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg',
      },
    });
  },

  // Utility to dismiss all toasts
  dismiss: () => {
    sonnerToast.dismiss();
  },

  // Utility to dismiss a specific toast
  dismissById: (id: string | number) => {
    sonnerToast.dismiss(id);
  },
};