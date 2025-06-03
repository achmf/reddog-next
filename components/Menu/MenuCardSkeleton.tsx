export default function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full pt-[75%] bg-gray-200">
        <div className="absolute top-3 right-3 bg-gray-300 rounded-full w-16 h-6"></div>
        <div className="absolute top-3 left-3 bg-gray-300 rounded-full w-12 h-6"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <div className="h-12 bg-gray-300 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  )
}
