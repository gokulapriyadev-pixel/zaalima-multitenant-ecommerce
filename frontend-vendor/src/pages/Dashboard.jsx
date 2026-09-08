import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OverviewCard from '../components/OverviewCard';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard title="Total Products" value="128" trend="+4 this week" />
            <OverviewCard title="Total Orders" value="342" trend="+18 this week" />
            <OverviewCard title="Revenue" value="$12,450" trend="+6.2%" />
            <OverviewCard title="Pending Orders" value="9" trend="-2" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;