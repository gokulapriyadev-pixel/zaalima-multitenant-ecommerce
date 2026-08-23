function OverviewCard({ title, value, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 ${trend.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}

export default OverviewCard;