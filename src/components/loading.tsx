import { FunctionComponent, PropsWithChildren } from 'react'
import { useStore } from '@nanostores/react'
import { InfinitySpin } from 'react-loader-spinner'

import { loadingStore } from '../stores/user-store'

const Loading: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const loading = useStore(loadingStore)
  return loading ? (
    <div className='loader'>
      <InfinitySpin width='200' color=' rgb(18, 66, 199)' />
    </div>
  ) : (
    children
  )
}

export default Loading
