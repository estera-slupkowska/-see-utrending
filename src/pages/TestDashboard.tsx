export function TestDashboard() {
  return (
    <div className="min-h-screen bg-background" style={{backgroundColor: '#0A0A0A', color: '#FFFFFF', minHeight: '100vh'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white">
          Test Dashboard - This Should Work
        </h1>
        <p className="text-gray-300 mt-4">
          If you can see this, the route protection is working and the issue is in the main DashboardPage component.
        </p>
      </div>
    </div>
  )
}