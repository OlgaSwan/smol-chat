import React, { FunctionComponent } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

const PrivateRoutes: FunctionComponent = () => {
  const { user } = useAuth()
  return <>{user ? <Outlet /> : <Navigate to='/login' />}</>
}

export default PrivateRoutes
