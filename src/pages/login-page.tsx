import React, { FunctionComponent, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppwriteException } from 'appwrite'

import { metadata } from '../components/head-meta/metadata'

import SmolChatLogo from '../components/smolchat-logo'
import { Alert } from '../components/alert'
import { Head } from '../components/head-meta/head'
import { useAuth } from '../hooks/useAuth'

import { Credentials } from '../types/user'

import { Snackbar } from '@mui/material'

const LoginPage: FunctionComponent = () => {
  const { user, handleUserLogin } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setCredentials({ ...credentials, [name]: value })
  }

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await handleUserLogin(credentials)
      navigate('/')
    } catch (error) {
      if (error instanceof AppwriteException) {
        setError(error.message)
        setOpen(true)
      }
    }
  }

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return

    setOpen(false)
  }

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  return (
    <div className='auth--container'>
      <Head title={metadata.login} />
      <SmolChatLogo />
      <div className='form--wrapper'>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        <form className='form--login' onSubmit={onSubmitForm}>
          <div className='form-fields--wrapper'>
            <div className='field--wrapper'>
              <label>Email</label>
              <input
                type='email'
                required
                name='email'
                autoComplete='on'
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
                autoComplete='on'
                placeholder='Enter password'
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
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
