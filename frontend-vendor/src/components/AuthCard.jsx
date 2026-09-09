function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;