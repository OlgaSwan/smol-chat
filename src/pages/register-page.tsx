import React, { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/auth-context'

export type CredentialsRegister = {
  name: string
  email: string
  password: string
  password1: string
}

const RegisterPage: FunctionComponent = () => {
  const { handleUserRegister } = useAuth()
  const [credentials, setCredentials] = useState<CredentialsRegister>({
    name: '',
    email: '',
    password: '',
    password1: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setCredentials({ ...credentials, [name]: value })
  }
  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={(e) => handleUserRegister(e, credentials)}>
          <div className='field--wrapper'>
            <label>Name</label>
            <input
              type='text'
              required
              name='name'
              placeholder='Enter your name...'
              value={credentials.name}
              onChange={handleInputChange}
            />
          </div>
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
            <label>Confirm Password</label>
            <input
              type='password'
              required
              name='password1'
              placeholder='Confirm your password'
              value={credentials.password1}
              onChange={handleInputChange}
            />
          </div>

          <div className='field--wrapper'>
            <input
              className='btn btn--lg btn--main'
              type='submit'
              value='Register'
            />
          </div>
        </form>

        <p>
          Already have an account? Log in <Link to='/login'>here</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
