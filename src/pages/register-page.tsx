import React, { FunctionComponent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { metadata } from '../components/head-meta/metadata'

import SmolChatLogo from '../components/smolchat-logo'
import { Alert } from '../components/alert'
import { Head } from '../components/head-meta/head'
import { useAuth } from '../hooks/useAuth'

import { CredentialsRegister } from '../types/user'

import { Snackbar } from '@mui/material'

const RegisterPage: FunctionComponent = () => {
  const { handleUserRegister } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

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

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (credentials.password !== credentials.password1) {
        throw new Error('Passwords do NOT match')
      }
      await handleUserRegister(credentials)
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setOpen(true)
      }
    }
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return

    setOpen(false)
  }

  return (
    <div className='auth--container'>
      <Head title={metadata.register} />
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
              <label>Name</label>
              <input
                type='text'
                required
                name='name'
                autoComplete='on'
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
                autoComplete='off'
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
                autoComplete='off'
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
