import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MetricCard from "../components/MetricCard";

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <MetricCard label="Revenue" value="₹0" trend="+0%" />
            <MetricCard label="Orders" value="0" trend="+0%" />
            <MetricCard label="Products" value="0" />
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-400">
              📦 No products yet — you'll add your first product this week.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;