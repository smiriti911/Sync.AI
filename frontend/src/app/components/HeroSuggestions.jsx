export default function SuggestionList({ suggestions, onSelect }) {
  return (
    <div className="mt-4 w-full max-w-2xl flex flex-col gap-2">
      {suggestions.map((row, i) => (
        <div key={i} className="flex justify-center gap-4">
          {row.map((suggestion, j) => (
            <button
              key={j}
              onClick={() => onSelect(suggestion)}
              className="bg-neutral-800/50 border border-neutral-700/80 text-white text-sm px-4 py-2 rounded-full hover:bg-neutral-700/60 transition max-w-[220px] truncate"
              title={suggestion}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
