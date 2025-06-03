"use client"

import { useState } from "react"

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Apa itu Korean Hotdog?",
    answer: "Korean Hotdog adalah street food khas Korea yang terdiri dari sosis yang dibalut adonan tepung, digoreng, dan dilumuri berbagai topping seperti keju mozzarella, potato cubes, atau ramen crumbs."
  },
  {
    question: "Berapa lama waktu pengiriman?",
    answer: "Untuk delivery, waktu pengiriman sekitar 30-45 menit tergantung lokasi. Untuk pickup di outlet, pesanan biasanya siap dalam 15-20 menit."
  },
  {
    question: "Apakah makanan halal?",
    answer: "Ya, semua produk Reddog menggunakan bahan-bahan halal dan telah tersertifikasi halal."
  },
  {
    question: "Metode pembayaran apa saja yang diterima?",
    answer: "Kami menerima pembayaran tunai, transfer bank, e-wallet (GoPay, OVO, DANA), dan kartu kredit/debit."
  },
  {
    question: "Apakah ada promo untuk pembelian dalam jumlah banyak?",
    answer: "Ya! Kami sering mengadakan promo bundle dan diskon untuk pembelian dalam jumlah tertentu. Follow social media kami untuk update promo terbaru."
  }
];

export default function FAQ() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <section className="w-full max-w-4xl py-16 px-4">
      <h3 className="text-3xl font-bold text-red-500 mb-12 text-center">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              onClick={() => setFaqOpen(faqOpen === index ? null : index)}
            >
              <span className="font-bold text-lg text-gray-800">{faq.question}</span>
              <svg
                className={`w-6 h-6 text-red-500 transition-transform duration-300 ${
                  faqOpen === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {faqOpen === index && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
