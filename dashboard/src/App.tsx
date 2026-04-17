import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { RuleCatalogPage } from './pages/RuleCatalogPage'
import { ExamplesPage } from './pages/ExamplesPage'
import { LivePage } from './pages/LivePage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/rules" element={<RuleCatalogPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </AppShell>
  )
}
