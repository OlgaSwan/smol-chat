import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Permission, Role, ID } from 'appwrite'
import { storage } from '../appwrite-config'

import { metadata } from './head-meta/metadata'

import { isEqual } from 'lodash-es'

import { MAX_SYMBOLS_NAME, MAX_SYMBOLS_BIO } from '../constants'
import { useAuth } from '../hooks/useAuth'
import { updateUser } from '../utils/updateUser'
import { getUserPhoto } from '../utils/getUserPhoto'
import { Head } from './head-meta/head'

import { Avatar, Dialog, Snackbar } from '@mui/material'

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
    inputRef.current?.click()
  }

  const deletePhotoClick = async () => {
    if (user && user.photo_id) {
      await storage.deleteFile(import.meta.env.VITE_BUCKET_ID, user.photo_id)
      await updateUser(user.$id, { photo_id: null })
      await getUserOnLoad()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files && e.target.files[0]
    if (!fileObj || !user) {
      return
    }

    if (user.photo_id) {
      try {
        await storage.deleteFile(import.meta.env.VITE_BUCKET_ID, user.photo_id)
      } catch {
        //ignored
      }
    }

    const photo = await storage.createFile(
      import.meta.env.VITE_BUCKET_ID,
      ID.unique(),
      fileObj,
      [Permission.write(Role.user(user.$id))]
    )
    await updateUser(user.$id, { photo_id: photo.$id })
    await getUserOnLoad()

    e.target.value = ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value

    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleDialogClose = () => {
    if (onClose) onClose()
  }

  const saveChanges = async () => {
    if (user)
      await updateUser(user.$id, { name: userInfo.name, bio: userInfo.bio })
    setInitialValue(userInfo)
    handleDialogClose()
    await getUserOnLoad()
  }

  const reset = () => {
    setUserInfo(initialValue)
  }

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
      <Head title={metadata.profile} />
      <div className='profile--container'>
        <div className='profile-photo--wrapper'>
          <Avatar
            src={getUserPhoto(user) ?? ''}
            alt={user.name}
            sx={{
              width: 130,
              height: 130,
              alignSelf: 'center',
              border: 'solid 2px rgb(137, 153, 200)',
            }}
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
          <div className='profile-field--wrapper'>
            <label className='profile--label'>Name</label>
            <textarea
              style={{
                resize: 'vertical',
                maxHeight: '120px',
                minHeight: '60px',
              }}
              name='name'
              required
              placeholder='Enter your name...'
              maxLength={MAX_SYMBOLS_NAME}
              value={userInfo.name}
              onChange={handleInputChange}
              id='textarea-form-name'
            />
            {initialValue.name !== userInfo.name && (
              <div className='countdown--symbols'>
                {userInfo.name && userInfo.name.length + '/' + MAX_SYMBOLS_NAME}
              </div>
            )}
          </div>

          <div className='profile-field--wrapper'>
            <label className='profile--label'>Bio</label>
            <textarea
              style={{
                resize: 'vertical',
                maxHeight: '200px',
                minHeight: '60px',
              }}
              name='bio'
              required
              placeholder='Enter your bio...'
              maxLength={MAX_SYMBOLS_BIO}
              value={userInfo.bio}
              onChange={handleInputChange}
              id='textarea-form-bio'
            />
            {initialValue.bio !== userInfo.bio && (
              <div className='countdown--symbols'>
                {userInfo.bio && userInfo.bio.length + '/' + MAX_SYMBOLS_BIO}
              </div>
            )}
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isSnackbarOpen}
          message='Careful - you have unsaved changes!'
          action={
            <>
              <button
                className='btn btn--cancel'
                onClick={reset}
                style={{ margin: '0 10px 0 0' }}
              >
                Reset
              </button>
              <button className='btn btn--secondary' onClick={saveChanges}>
                Save
              </button>
            </>
          }
        />
      </div>
    </Dialog>
  )
}

export default Profile
