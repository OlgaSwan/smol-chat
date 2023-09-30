import React, { FunctionComponent, useRef } from 'react'
import { Permission, Role, ID } from 'appwrite'
import {
  databases,
  storage,
  BUCKET_ID,
  DATABASE_ID,
  COLLECTION_ID_USERS,
} from '../appwrite-config'

import { Avatar } from '@mui/material'

import { useAuth } from '../context/auth-context'
import { User } from '../types/auth-context'

const Profile: FunctionComponent = () => {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click()
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files && e.target.files[0]
    if (!fileObj) {
      return
    }

    if (user) {
      const permissions = [Permission.write(Role.user(user.$id))]
      const photo = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        fileObj,
        permissions
      )
      await databases.updateDocument<User>(
        DATABASE_ID,
        COLLECTION_ID_USERS,
        user.$id,
        { photo_id: photo.$id }
      )
    }
    e.target.value = ''
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Avatar alt={user.name} sx={{ width: 100, height: 100 }}>
          {user.name.slice(0, 1)}
        </Avatar>
        <div>
          <input
            style={{ display: 'none' }}
            ref={inputRef}
            type='file'
            accept='image/jpg, image/png'
            onChange={handleFileChange}
          />
          <button onClick={handleClick}>Change photo</button>
          <button>Delete photo</button>
        </div>
      </div>
      <div>
        Name
        <input type='text' />
        Bio
        <input type='text' />
      </div>
    </div>
  )
}

export default Profile
