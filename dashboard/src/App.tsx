import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { RuleCatalogPage } from './pages/RuleCatalogPage'
import { ExamplesPage } from './pages/ExamplesPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/rules" replace />} />
        <Route path="/rules" element={<RuleCatalogPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </AppShell>
  )
}
