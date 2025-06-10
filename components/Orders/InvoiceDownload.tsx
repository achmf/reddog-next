"use client";

import { useState } from "react";
import { Download, FileDown, Image, Eye } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import InvoicePreviewModal from "./InvoicePreviewModal";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  add_ons: any;
};

type Order = {
  id: string;
  outlet_id: string;
  outlet_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_token: string;
  buyer_name: string;
  phone_number?: string;
  email?: string;
  pickup_time: string;
  validation_code?: string;
};

interface InvoiceDownloadProps {
  order: Order;
  orderItems: OrderItem[];
}

function InvoiceDownload({ order, orderItems }: InvoiceDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'image' | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceHTML, setInvoiceHTML] = useState<string>('');

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return { text: "Pembayaran Dikonfirmasi" };
      case "received":
        return { text: "Pesanan Diterima" };
      case "cooking":
        return { text: "Lagi Dimasakin" };
      case "ready":
        return { text: "Siap Diambil" };
      case "completed":
        return { text: "Pesanan Selesai" };
      case "pending":
        return { text: "Menunggu Pembayaran" };
      case "canceled":
        return { text: "Pesanan Dibatalkan" };
      default:
        return { text: status.charAt(0).toUpperCase() + status.slice(1) };
    }
  };

  // Format add-ons in a user-friendly way
  const formatAddOns = (addOns: any) => {
    if (!addOns || (typeof addOns === 'object' && Object.keys(addOns).length === 0)) {
      return null;
    }

    if (typeof addOns === 'string') {
      try {
        addOns = JSON.parse(addOns);
      } catch {
        return addOns;
      }
    }

    if (typeof addOns === 'object') {
      const formattedAddOns = [];
      
      for (const [key, value] of Object.entries(addOns)) {
        if (value && value !== '' && value !== '[]') {
          if (key === 'topping' && Array.isArray(value)) {
            const toppings = value.filter(t => t && t !== '').join(', ');
            if (toppings) formattedAddOns.push(`Topping: ${toppings}`);
          } else if (key === 'quantity' && value !== 1) {
            // Skip quantity as it's already shown separately
            continue;
          } else if (typeof value === 'boolean') {
            if (value) formattedAddOns.push(key.charAt(0).toUpperCase() + key.slice(1));
          } else if (typeof value === 'string' && value !== '') {
            formattedAddOns.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
          }
        }
      }
      
      return formattedAddOns.length > 0 ? formattedAddOns.join(', ') : null;
    }

    return String(addOns);
  };
  // Check if order is ready for pickup (validation codes should only show when ready)
  const isReadyForPickup = (status: string) => {
    return status === 'ready' || status === 'completed';
  };

  // Generate QR Code for validation (only when ready)
  const generateQRCode = async (orderId: string, validationCode?: string) => {
    // Only generate QR code if order is ready for pickup
    if (!isReadyForPickup(order.status)) {
      return '';
    }

    try {
      const qrData = validationCode 
        ? `${orderId}|${validationCode}` 
        : orderId;
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };const generateInvoiceHTML = async (): Promise<string> => {
    const statusInfo = getStatusInfo(order.status);
    const qrCodeDataURL = await generateQRCode(order.id, order.validation_code);
    
    return `
      <div style="
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background: white;
        color: #1f2937;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #cc140e; padding-bottom: 20px;">
          <h1 style="
            color: #cc140e;
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
          ">REDDOG</h1>
          <h2 style="
            color: #374151;
            font-size: 24px;
            margin: 0;
            font-weight: 600;
          ">Invoice Pesanan</h2>
        </div>

        <!-- Order Info -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        ">
          <div>
            <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Detail Pesanan</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>ID Pesanan:</strong> ${order.id}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Tanggal:</strong> ${formatDate(order.created_at)}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Status:</strong> ${statusInfo.text}</p>
          </div>
          <div>
            <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Info Pickup</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Outlet:</strong> ${order.outlet_name}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Waktu Pickup:</strong> ${formatDate(order.pickup_time)}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div style="
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        ">
          <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">Info Customer</h3>
          <p style="margin: 5px 0; color: #6b7280;"><strong>Nama:</strong> ${order.buyer_name}</p>
          ${order.phone_number ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Telepon:</strong> ${order.phone_number}</p>` : ''}
          ${order.email ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> ${order.email}</p>` : ''}
        </div>

        <!-- Order Items -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">Detail Item</h3>
          <table style="
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          ">
            <thead>
              <tr style="background: #cc140e; color: white;">
                <th style="padding: 15px; text-align: left; font-weight: 600;">Item</th>
                <th style="padding: 15px; text-align: center; font-weight: 600;">Qty</th>
                <th style="padding: 15px; text-align: right; font-weight: 600;">Harga</th>
                <th style="padding: 15px; text-align: right; font-weight: 600;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map((item, index) => {
                const formattedAddOns = formatAddOns(item.add_ons);
                return `
                  <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'}">
                    <td style="padding: 15px;">
                      <div>
                        <div style="font-weight: 600; color: #374151;">${item.name}</div>
                        ${formattedAddOns ? `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${formattedAddOns}</div>` : ''}
                      </div>
                    </td>
                    <td style="padding: 15px; text-align: center; color: #6b7280;">${item.quantity}</td>
                    <td style="padding: 15px; text-align: right; color: #6b7280;">${formatPrice(item.price)}</td>
                    <td style="padding: 15px; text-align: right; font-weight: 600; color: #374151;">${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Total -->
        <div style="
          text-align: right;
          padding: 20px;
          background: #cc140e;
          color: white;
          border-radius: 8px;
          margin-bottom: 30px;
        ">
          <h3 style="margin: 0; font-size: 24px; font-weight: bold;">
            Total: ${formatPrice(order.total_amount)}
          </h3>
        </div>        <!-- Validation Section (Only show when order is ready for pickup) -->
        ${isReadyForPickup(order.status) && (order.validation_code || qrCodeDataURL) ? `
        <div style="
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          text-align: center;
        ">
          <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">Validasi Pesanan</h3>
          <div style="display: flex; justify-content: center; align-items: center; gap: 30px; flex-wrap: wrap;">
            ${qrCodeDataURL ? `
            <div style="text-align: center;">
              <img src="${qrCodeDataURL}" alt="QR Code" style="width: 120px; height: 120px; border: 2px solid #cc140e; border-radius: 8px;" />
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Scan QR Code untuk validasi</p>
            </div>
            ` : ''}
            ${order.validation_code ? `
            <div style="text-align: center;">
              <div style="
                background: #cc140e;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 3px;
                font-family: 'Courier New', monospace;
              ">${order.validation_code}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Kode Validasi</p>
            </div>
            ` : ''}
          </div>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #6b7280; text-align: center;">
            Tunjukkan QR Code atau kode validasi di atas kepada petugas saat pengambilan pesanan.
          </p>
        </div>
        ` : ''}

        <!-- Status Notice (When not ready for pickup) -->
        ${!isReadyForPickup(order.status) ? `
        <div style="
          margin-bottom: 30px;
          padding: 20px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          text-align: center;
        ">
          <h3 style="color: #92400e; font-size: 18px; margin: 0 0 10px 0; font-weight: 600;">Info Validasi</h3>
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            QR Code dan kode validasi akan tersedia setelah pesanan Anda siap untuk diambil.
          </p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        ">
          <p style="margin: 5px 0;">Terima kasih telah memesan di Reddog!</p>
          <p style="margin: 5px 0;">Invoice ini digenerate otomatis pada ${formatDate(new Date().toISOString())}</p>
        </div>
      </div>
    `;
  };
  const downloadAsPDF = async () => {
    setIsDownloading(true);
    setDownloadFormat('pdf');
    
    try {
      // Generate the HTML content
      const invoiceHTML = await generateInvoiceHTML();
      
      // Create a temporary container
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = invoiceHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
      setDownloadFormat(null);
    }
  };
  const downloadAsImage = async () => {
    setIsDownloading(true);
    setDownloadFormat('image');
    
    try {
      // Generate the HTML content
      const invoiceHTML = await generateInvoiceHTML();
      
      // Create a temporary container
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = invoiceHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempDiv);

      // Download as image
      const link = document.createElement('a');
      link.download = `invoice-${order.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
      setDownloadFormat(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Download Invoice</h3>
          <p className="text-sm text-gray-600">
            Unduh invoice pesanan Anda dalam format PDF atau gambar
          </p>
        </div>
        <Download className="h-6 w-6 text-primary" />
      </div>      <div className="flex flex-col sm:flex-row gap-3">        {/* Preview Button */}
        <button
          onClick={async () => {
            const html = await generateInvoiceHTML();
            setInvoiceHTML(html);
            setShowPreview(true);
          }}
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>

        <button
          onClick={downloadAsPDF}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading && downloadFormat === 'pdf' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Mengunduh PDF...</span>
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              <span>Download PDF</span>
            </>
          )}
        </button>

        <button
          onClick={downloadAsImage}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading && downloadFormat === 'image' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Mengunduh Gambar...</span>
            </>
          ) : (
            <>
              <Image className="h-4 w-4" />
              <span>Download Gambar</span>
            </>
          )}
        </button>
      </div>      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Format PDF cocok untuk dokumen resmi, sedangkan format gambar mudah dibagikan di media sosial atau pesan.
        </p>
      </div>      {/* Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        invoiceHTML={invoiceHTML}
      />
    </div>
  );
}

export default InvoiceDownload;
