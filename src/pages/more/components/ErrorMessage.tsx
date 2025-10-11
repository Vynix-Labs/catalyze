interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex justify-between items-center">
      <p className="text-red-600 text-sm">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 text-sm"
        >
          ✕
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;