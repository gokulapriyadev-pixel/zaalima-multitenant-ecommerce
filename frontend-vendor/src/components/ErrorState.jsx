function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
      <p className="text-red-800 font-medium">Something went wrong</p>
      <p className="text-sm text-red-600 mt-1">
        {message || "We couldn't load this data. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;