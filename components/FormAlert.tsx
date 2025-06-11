"use client"

import React from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface FormAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

const FormAlert: React.FC<FormAlertProps> = ({ type, message, className = '' }) => {
  const alertStyles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className={`
      ${alertStyles[type]} 
      border rounded-lg p-3 mt-2 flex items-center gap-2 text-sm
      ${className}
    `}>
      <Icon size={16} className={`${iconStyles[type]} flex-shrink-0`} />
      <span>{message}</span>
    </div>
  );
};

export default FormAlert;
