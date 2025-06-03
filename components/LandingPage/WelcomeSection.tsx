// src/components/WelcomeSection.tsx
export default function WelcomeSection() {
    return (
      <section className="w-full max-w-4xl px-6 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-red-500 mb-6">
          Welcome To REDDOG!
        </h2>
        <p className="text-lg text-gray-800 leading-relaxed">
          Reddog adalah restoran Korea yang menyajikan{" "}
          <span className="font-semibold">Korean Hotdog</span> dan{" "}
          <span className="font-semibold">Topokki</span> dengan kualitas yang baik, rasa yang unik, dan harga yang terjangkau.
          Semua hidangan otentik Korea di Reddog dibuat{" "}
          <span className="font-semibold">fresh from the kitchen</span> dan bisa
          dipesan di mana saja, kapanpun!
        </p>
      </section>
    );
  }
  