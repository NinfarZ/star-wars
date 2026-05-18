interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({ currentPage, totalPages, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-6 mt-10">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-[#FFE81F]/40 text-[#FFE81F] text-xs tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFE81F]/10 cursor-pointer"
      >
        Prev
      </button>
      <span className="text-gray-200 text-sm tabular-nums">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-[#FFE81F]/40 text-[#FFE81F] text-xs tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFE81F]/10 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
