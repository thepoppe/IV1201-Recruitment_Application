const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles = "px-4 py-2 transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white rounded-md hover:bg-blue-700",
    text: "text-gray-600 hover:text-gray-900",
  };

  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
