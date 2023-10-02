import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Permission, Role, ID } from 'appwrite'
import { storage, BUCKET_ID } from '../appwrite-config'

import { isEqual } from 'lodash-es'

import { Avatar, Dialog } from '@mui/material'

import { useAuth } from '../context/auth-context'
import { updateUser } from '../utils/updateUser'
import { getUserPhoto } from '../utils/getUserPhoto'
import { UnsavedChangesSnackbar } from './unsavedChangesSnackbar'

type UserInfo = {
  name: string
  bio: string
}

interface ProfileProps {
  open: boolean
  onClose?: () => void
}

const emptyUserInfo: UserInfo = { name: '', bio: '' }

const Profile: FunctionComponent<ProfileProps> = ({ open, onClose }) => {
  const { user, getUserOnLoad } = useAuth()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [initialValue, setInitialValue] = useState<UserInfo>(emptyUserInfo)
  const [userInfo, setUserInfo] = useState<UserInfo>(emptyUserInfo)

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const userInfo: UserInfo = { name: user.name, bio: user.bio ?? '' }

    setUserInfo(userInfo)
    setInitialValue(userInfo)
  }, [user])

  useEffect(() => {
    setIsSnackbarOpen(!isEqual(initialValue, userInfo))
  }, [initialValue, userInfo])

  const changePhotoClick = () => {
    if (inputRef.current) inputRef.current.click()
  }

  const deletePhotoClick = async () => {
    if (user && user.photo_id) {
      await storage.deleteFile(BUCKET_ID, user.photo_id)
      await updateUser(user.$id, { photo_id: null })
      await getUserOnLoad()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files && e.target.files[0]
    if (!fileObj || !user) {
      return
    }

    if (user.photo_id) await storage.deleteFile(BUCKET_ID, user.photo_id)

    const photo = await storage.createFile(BUCKET_ID, ID.unique(), fileObj, [
      Permission.write(Role.user(user.$id)),
    ])
    await updateUser(user.$id, { photo_id: photo.$id })
    await getUserOnLoad()

    e.target.value = ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleDialogClose = useCallback(() => {
    //if (isSnackbarOpen) return

    if (onClose) onClose()
  }, [onClose])

  const saveChanges = useCallback(async () => {
    if (user)
      await updateUser(user.$id, { name: userInfo.name, bio: userInfo.bio })
    setInitialValue(userInfo)
    handleDialogClose()
  }, [user, userInfo, handleDialogClose])

  const reset = useCallback(() => {
    setUserInfo(initialValue)
  }, [initialValue])

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      sx={{ backdropFilter: 'blur(7px) sepia(5%)' }}
      PaperProps={{ sx: { borderRadius: '10px' } }}
    >
      <div className='profile--container'>
        <div className='profile-photo--wrapper'>
          <Avatar
            src={getUserPhoto(user) ?? ''}
            alt={user.name}
            sx={{ width: 100, height: 100, alignSelf: 'center' }}
          >
            {user.name.slice(0, 1)}
          </Avatar>
          <div className='profile-btn--wrapper'>
            <input
              style={{ display: 'none' }}
              ref={inputRef}
              type='file'
              accept='image/jpg, image/png'
              onChange={handleFileChange}
            />
            <button className='btn btn--secondary' onClick={changePhotoClick}>
              Change photo
            </button>
            <button
              style={!user.photo_id ? { display: 'none' } : {}}
              className='btn btn--cancel'
              onClick={deletePhotoClick}
            >
              Delete photo
            </button>
          </div>
        </div>
        <div className='profile-fields--wrapper'>
          <div className='field--wrapper'>
            <label>Name</label>
            <input
              type='text'
              name='name'
              required
              placeholder='Enter your name...'
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </div>

          <div className='field--wrapper'>
            <label>Bio</label>
            <input
              type='text'
              name='bio'
              required
              placeholder='Enter your bio...'
              value={userInfo.bio}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <UnsavedChangesSnackbar
          open={isSnackbarOpen}
          saveChanges={saveChanges}
          reset={reset}
        />
      </div>
    </Dialog>
  )
}

export default Profile
