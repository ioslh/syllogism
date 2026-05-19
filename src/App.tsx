import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ValidatePage from './pages/ValidatePage'
import FallaciesPage from './pages/FallaciesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/validate" replace />} />
        <Route path="validate" element={<ValidatePage />} />
        <Route path="fallacies" element={<FallaciesPage />} />
        <Route path="fallacies/:fallacy" element={<FallaciesPage />} />
      </Route>
    </Routes>
  )
}
