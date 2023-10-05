import React, { FunctionComponent, useEffect, useState } from 'react'

import { User } from '../types/auth-context'
import { getUser } from '../utils/getUser'
import { getUserPhoto } from '../utils/getUserPhoto'
import { Avatar } from '@mui/material'

interface MiniProfileProps {
  id: string
}

const MiniProfile: FunctionComponent<MiniProfileProps> = ({ id }) => {
  const [user, setUser] = useState<User | null>(null)

  const getAndSetUser = async (id: string) => {
    const user = await getUser(id)
    if (user) setUser(user)
  }

  useEffect(() => {
    getAndSetUser(id)
  }, [id])

  return (
    <>
      {user && (
        <div
          className='miniprofile--container'
          style={{
            alignItems: user.bio && user.bio.length > 50 ? 'start' : 'center',
          }}
        >
          <div className='miniprofile-photo--wrapper'>
            <Avatar
              src={getUserPhoto(user) ?? ''}
              alt={user.name}
              sx={{ width: 60, height: 60, alignSelf: 'center' }}
            >
              {user.name.slice(0, 1)}
            </Avatar>
          </div>
          <div className='miniprofile-fields--wrapper'>
            <div className='miniprofile-field--wrapper'>
              <label className='miniprofile-field--label'>Name</label>
              <p>{user.name}</p>
            </div>
            <div className='miniprofile-field--wrapper'>
              <label className='miniprofile-field--label'>Bio</label>
              <p>{user.bio}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MiniProfile
