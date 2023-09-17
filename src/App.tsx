import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './components/private-routes'
import { AuthProvider } from './utils/auth-context'

import Room from './pages/room'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Room />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
