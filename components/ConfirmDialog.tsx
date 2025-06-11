"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = 'warning',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-600',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
      iconBg: 'bg-red-100'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      message: 'text-yellow-600',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      iconBg: 'bg-yellow-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-600',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
      iconBg: 'bg-blue-100'
    }
  };

  const styles = typeStyles[type];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !isLoading) {
      onConfirm();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div 
          className={`
            bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 
            transform transition-all duration-300 scale-100 opacity-100
            border ${styles.border}
          `}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold ${styles.title} mb-2`}>
                  {title}
                </h3>
                <p className={`text-sm ${styles.message} leading-relaxed`}>
                  {message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                order-2 sm:order-1
              "
            >
              {cancelText}
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 
                focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed order-1 sm:order-2 flex items-center justify-center gap-2
                ${styles.confirmBtn}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
