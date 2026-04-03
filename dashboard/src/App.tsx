import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { RuleCatalogPage } from './pages/RuleCatalogPage'
import { AnalysisPlaygroundPage } from './pages/AnalysisPlaygroundPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/rules" replace />} />
        <Route path="/rules" element={<RuleCatalogPage />} />
        <Route path="/analyze" element={<AnalysisPlaygroundPage />} />
      </Routes>
    </AppShell>
  )
}
