import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { subscribe } from './model/subscribe'

import Loading from './components/loading'
import PrivateRoutes from './components/private-routes'
import LoginPage from './pages/login-page'
import RegisterPage from './pages/register-page'
import Chats from './pages/chats'

function App() {
  useEffect(() => {
    const unsubscribe = subscribe()
    return () => unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Loading>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<PrivateRoutes />}>
            <Route path='/' element={<Chats />} />
            <Route path='*' element={<Chats />} />
          </Route>
        </Routes>
      </Loading>
    </BrowserRouter>
  )
}

export default App
