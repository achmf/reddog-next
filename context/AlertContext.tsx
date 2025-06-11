"use client"

import React, { createContext, useContext, useCallback, useState } from 'react';
import Alert from '@/components/Alert';

interface AlertItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertItem, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((alert: Omit<AlertItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAlert: AlertItem = {
      ...alert,
      id,
      autoClose: alert.autoClose ?? true,
      duration: alert.duration ?? 4000
    };
    
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showAlert({ type: 'success', message, title });
  }, [showAlert]);

  const showError = useCallback((message: string, title?: string) => {
    showAlert({ type: 'error', message, title, autoClose: false });
  }, [showAlert]);

  const showWarning = useCallback((message: string, title?: string) => {
    showAlert({ type: 'warning', message, title });
  }, [showAlert]);

  const showInfo = useCallback((message: string, title?: string) => {
    showAlert({ type: 'info', message, title });
  }, [showAlert]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const value: AlertContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            autoClose={alert.autoClose}
            duration={alert.duration}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
