"use client";

import { useState } from "react";
import { X, Eye } from "lucide-react";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceHTML: string;
}

function InvoicePreviewModal({ isOpen, onClose, invoiceHTML }: InvoicePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Preview Invoice</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          <div 
            dangerouslySetInnerHTML={{ __html: invoiceHTML }}
            className="transform scale-75 origin-top-left"
            style={{ width: '133.33%' }} // Compensate for scale
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Ini adalah preview invoice Anda. Tutup modal ini untuk melanjutkan download.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreviewModal;
