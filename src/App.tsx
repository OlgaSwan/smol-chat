import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/auth-context'
import PrivateRoutes from './components/private-routes'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import Chats from './pages/chats'
import GlobalChatPage from './pages/global-chat-page'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<GlobalChatPage />} />
            <Route path='/chats' element={<Chats />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
