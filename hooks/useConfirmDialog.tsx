"use client";

import { useState, useCallback } from 'react';

interface UseConfirmDialogReturn {
  showDialog: (options: ConfirmOptions) => void;
  ConfirmDialogComponent: React.FC;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showDialog = useCallback((dialogOptions: ConfirmOptions) => {
    setOptions(dialogOptions);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!options) return;

    setIsLoading(true);
    try {
      await options.onConfirm();
    } catch (error) {
      console.error('Error in confirm action:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setOptions(null);
    }
  }, [options]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
    setIsLoading(false);
  }, []);

  const ConfirmDialogComponent: React.FC = useCallback(() => {
    if (!options) return null;

    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
          onClick={handleClose}
        />
        
        {/* Dialog */}
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div 
            className={`
              bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 
              transform transition-all duration-300 scale-100 opacity-100
              border ${getTypeStyles(options.type || 'warning').border}
            `}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full ${getTypeStyles(options.type || 'warning').iconBg} flex items-center justify-center flex-shrink-0`}>
                  {getIcon(options.type || 'warning')}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold ${getTypeStyles(options.type || 'warning').title} mb-2`}>
                    {options.title}
                  </h3>
                  <p className={`text-sm ${getTypeStyles(options.type || 'warning').message} leading-relaxed`}>
                    {options.message}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="
                  px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                  rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  order-2 sm:order-1
                "
              >
                {options.cancelText || "Batal"}
              </button>
              
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed order-1 sm:order-2 flex items-center justify-center gap-2
                  ${getTypeStyles(options.type || 'warning').confirmBtn}
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  options.confirmText || "Ya, Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }, [options, isOpen, isLoading, handleClose, handleConfirm]);

  return {
    showDialog,
    ConfirmDialogComponent
  };
};

// Helper functions
const getTypeStyles = (type: 'danger' | 'warning' | 'info') => {
  const styles = {
    danger: {
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-600',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      message: 'text-yellow-600',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    info: {
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-600',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };
  return styles[type];
};

const getIcon = (type: 'danger' | 'warning' | 'info') => {
  const iconClass = `w-6 h-6 ${getTypeStyles(type).icon}`;
  
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
      />
    </svg>
  );
};
