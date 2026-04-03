export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Spatial Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Dev-time UI performance engine explorer
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-medium">
            Engine ready
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium">
            v0.8.1
          </span>
        </div>
      </div>
    </div>
  )
}
