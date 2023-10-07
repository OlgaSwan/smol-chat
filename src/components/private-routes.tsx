import React, { FunctionComponent } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import Header from './header'

const PrivateRoutes: FunctionComponent = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' />
  return (
    <main className='container'>
      <Header />
      <div className='outlet--container'>
        <Outlet />
      </div>
    </main>
  )
}

export default PrivateRoutes
