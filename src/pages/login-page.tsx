import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../utils/auth-context'

export interface Credentials {
  email: string
  password: string
  password1?: string
}

const LoginPage = () => {
  const { user, handleUserLogin } = useAuth()
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setCredentials({ ...credentials, [name]: value })
  }

  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={(e) => handleUserLogin(e, credentials)}>
          <div className='field--wrapper'>
            <label>Email</label>
            <input
              type='email'
              required
              name='email'
              placeholder='Enter your email...'
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className='field--wrapper'>
            <label>Password</label>
            <input
              type='password'
              required
              name='password'
              placeholder='Enter password'
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>

          <div className='field--wrapper'>
            <input
              className='btn btn--lg btn--main'
              type='submit'
              value='Log in'
            />
          </div>
        </form>

        <p>
          Don't have an account? Register <Link to='/register'>here</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
