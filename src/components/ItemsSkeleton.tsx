const ItemsSkeleton = ({ count }: { count: number }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-30 h-4 bg-gray-600/20 animate-pulse mb-2"></div>
    ))}
  </div>
);

export default ItemsSkeleton;
