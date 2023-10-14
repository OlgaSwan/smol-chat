import React, { forwardRef } from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'

export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
))
