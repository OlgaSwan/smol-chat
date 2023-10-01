import React, { FunctionComponent } from 'react'
import UserSearch from '../components/userSearch'

const Chats: FunctionComponent = () => {
  return (
    <div className='chats--container' style={{ display: 'flex' }}>
      <div style={{ background: 'green' }}>Chats <UserSearch/></div>
      <div style={{ background: 'blue' }}>Messages/Room</div>
    </div>
  )
}

export default Chats
