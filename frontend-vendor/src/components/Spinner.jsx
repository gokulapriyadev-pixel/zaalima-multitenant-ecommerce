function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default Spinner;