import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const baseStyles = "py-2 px-4 rounded text-white";
  const variantStyles = {
    default: "bg-gray-500 hover:bg-gray-600",
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-green-500 hover:bg-green-600",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
