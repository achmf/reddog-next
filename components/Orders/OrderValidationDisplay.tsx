"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Copy, Eye, EyeOff, QrCode } from "lucide-react";

interface OrderValidationDisplayProps {
  orderId: string;
  validationCode: string;
  buyerName: string;
  totalAmount: number;
  status: string;
}

export default function OrderValidationDisplay({
  orderId,
  validationCode,
  buyerName,
  totalAmount,
  status
}: OrderValidationDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [orderId, validationCode]);
  const generateQRCode = async () => {
    try {
      const qrData = {
        orderId,
        code: validationCode,
        buyer: buyerName,
        total: totalAmount,
        timestamp: Date.now()
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 200
      });

      setQrCodeUrl(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(validationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Only show validation for orders that are ready or completed
  if (status !== 'ready' && status !== 'completed') {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-green-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <QrCode className="h-6 w-6 text-green-600" />
        Order Validation
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-xl p-6 mb-4">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="Order QR Code" 
                className="mx-auto mb-4"
                width={200}
                height={200}
              />
            ) : (
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <QrCode className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Show this QR code to the cashier for quick validation
          </p>
        </div>

        {/* Validation Code Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validation Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border rounded-lg px-4 py-3">
                <div className="font-mono text-2xl font-bold text-center tracking-wider">
                  {showCode ? validationCode : '••••••••'}
                </div>
              </div>
              <button
                onClick={() => setShowCode(!showCode)}
                className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
                title={showCode ? "Hide code" : "Show code"}
              >
                {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">Code copied to clipboard!</p>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Show the QR code to the cashier</li>
                <li>• Or provide the validation code manually</li>
                <li>• The cashier will scan/enter it to complete your order</li>
              </ul>
            </div>
            
            {status === 'ready' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Your order is ready!</h4>
                <p className="text-green-700">
                  Please proceed to the counter with your validation code or QR code to pick up your order.
                </p>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🎉 Order Completed!</h4>
                <p className="text-gray-700">
                  Thank you for your purchase! We hope you enjoyed your meal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
