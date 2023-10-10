import { FunctionComponent, useState } from 'react'

import { Avatar } from '@mui/material'
import { Logout } from '@mui/icons-material'

import Profile from './profile'
import { useAuth } from '../hooks/useAuth'
import { getUserPhoto } from '../utils/getUserPhoto'

const Header: FunctionComponent = () => {
  const { user, handleUserLogOut } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return <>Loading...</>

  return (
    <div id='header--wrapper'>
      <Profile open={open} onClose={() => setOpen(false)} />
      <div className='header--link--wrapper' onClick={() => setOpen(true)}>
        <div className='header--link'>Welcome, {user.name}</div>
        <Avatar
          alt={user.name}
          src={getUserPhoto(user) ?? ''}
          sx={{ width: 24, height: 24 }}
        >
          {user.name.slice(0, 1)}
        </Avatar>
      </div>
      <Logout onClick={handleUserLogOut} className='header--link' />
    </div>
  )
}

export default Header
