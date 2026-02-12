export const CardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <div className="aspect-[2/3] bg-gray-600"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[70vh] animate-pulse">
      <div className="absolute inset-0 bg-gray-700"></div>
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="max-w-3xl space-y-4">
          <div className="h-12 bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-600 rounded w-full"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          <div className="flex gap-4 mt-6">
            <div className="h-12 bg-gray-600 rounded w-32"></div>
            <div className="h-12 bg-gray-600 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative h-[50vh] bg-gray-700 mb-8"></div>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
