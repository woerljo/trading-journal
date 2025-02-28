export function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <button
      className={`p-2 rounded text-white font-bold ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
} 