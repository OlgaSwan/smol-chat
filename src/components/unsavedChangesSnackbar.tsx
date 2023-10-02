import { Slide, Snackbar } from '@mui/material'
import { memo } from 'react'

interface UnsavedChangesSnackbarProps {
  open: boolean
  saveChanges: () => void
  reset: () => void
}

export const UnsavedChangesSnackbar = memo(
  ({ open, saveChanges, reset }: UnsavedChangesSnackbarProps) => (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={(props) => <Slide {...props} direction='up' />}
      open={open}
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
  )
)
