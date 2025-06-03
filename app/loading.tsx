export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-100 via-white to-yellow-100">
      <div className="relative flex flex-col items-center">
        {/* Modern animated loader */}
        <div className="w-16 h-16 rounded-full border-4 border-red-400 border-t-transparent animate-spin shadow-lg"></div>
        <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          </svg>
        </div>
      </div>
      <p className="mt-8 text-lg font-semibold text-red-500 animate-fadeIn">Loading, please wait...</p>
    </div>
  )
}
