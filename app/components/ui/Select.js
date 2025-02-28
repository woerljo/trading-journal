export function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-gray-300">
          {label}
        </label>
      )}
      <select
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        {...props}
      >
        {children}
      </select>
    </div>
  );
} 