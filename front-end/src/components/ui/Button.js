const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
