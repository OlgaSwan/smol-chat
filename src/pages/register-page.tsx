import React, { FunctionComponent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import SmolChatLogo from '../components/smolchat-logo'
import { useAuth } from '../hooks/useAuth'

import { CredentialsRegister } from '../types/user'

const RegisterPage: FunctionComponent = () => {
  const { handleUserRegister } = useAuth()
  const [credentials, setCredentials] = useState<CredentialsRegister>({
    name: '',
    email: '',
    password: '',
    password1: '',
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setCredentials({ ...credentials, [name]: value })
  }
  return (
    <div className='auth--container'>
      <SmolChatLogo />
      <div className='form--wrapper'>
        <form
          className='form--login'
          onSubmit={async (e) => {
            if (await handleUserRegister(e, credentials)) navigate('/')
          }}
        >
          <div className='form-fields--wrapper'>
            <div className='field--wrapper'>
              <label>Name</label>
              <input
                type='text'
                required
                name='name'
                autoComplete="on"
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
                autoComplete="on"
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
                autoComplete="off"
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
                autoComplete="off"
                placeholder='Confirm your password'
                value={credentials.password1}
                onChange={handleInputChange}
              />
            </div>
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
