import React, { useRef } from 'react'
import { Permission, Role } from 'appwrite'
import { storage, BUCKET_ID } from '../../appwrite-config'
import { useAuth } from '../../utils/auth-context'

const Profile = () => {
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
        user.$id,
        fileObj,
        permissions
      )
    }
    e.target.value = ''
  }

  return (
    <>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleClick}>Add Photo</button>
    </>
  )
}

export default Profile
