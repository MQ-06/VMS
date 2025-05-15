// src/components/ui/ErrorMessage.jsx
const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div
      className=" text-red-700 px-4 py-2 rounded text-sm"
      role="alert"
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
