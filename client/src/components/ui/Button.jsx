const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-primary text-white py-2 px-4 rounded hover:bg-blue-500 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
