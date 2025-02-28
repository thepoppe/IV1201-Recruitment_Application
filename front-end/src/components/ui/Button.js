const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles = "px-4 py-2 transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400",
    text: "text-gray-600 hover:text-gray-900 disabled:text-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={props.disabled}
    >
      {children}
    </button>
  );
};

export default Button;
