/**
 * Button component for consistent button styling across the application.
 *
 * This reusable component provides styled buttons with different variants
 * for different purposes (primary, secondary, text, danger). It handles
 * disabled states and allows for custom class extensions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content/label
 * @param {string} [props.variant="primary"] - Button style variant: "primary", "secondary", "text", or "danger"
 * @param {string} [props.className=""] - Additional CSS classes to apply
 * @param {boolean} [props.disabled] - Whether the button is disabled
 * @param {Function} [props.onClick] - Click handler function
 * @param {string} [props.type] - Button type attribute (e.g., "button", "submit")
 * @returns {JSX.Element} The rendered Button component
 */
const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  /**
   * Base styles applied to all button variants
   * @const {string}
   */
  const baseStyles =
    "px-4 py-2 transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed";

  /**
   * Style definitions for each button variant
   * @const {Object.<string, string>}
   */
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400",
    text: "text-gray-600 hover:text-gray-900 disabled:text-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
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
