import React, { FunctionComponent, PropsWithChildren } from 'react'
import { useStore } from '@nanostores/react'

import { loadingStore } from '../model/userStore'

const Loading: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const loading = useStore(loadingStore)
  return loading ? <div>Loading...</div> : children
}

export default Loading
