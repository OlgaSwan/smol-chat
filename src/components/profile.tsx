import React, { useRef } from "react"
import { Permission, Role } from "appwrite"
import { storage, BUCKET_ID } from "../appwrite-config"
import { useAuth } from "../utils/auth-context"
import { Avatar } from "@mui/material"

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
    e.target.value = ""
  }

  if (!user) {
    return "Loading..."
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <Avatar alt={user.name} sx={{ width: 100, height: 100 }}>
          {user.name.slice(0, 1)}
        </Avatar>
        <div>
          <input
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            accept="image/jpg, image/png"
            onChange={handleFileChange}
          />
          <button onClick={handleClick}>Change photo</button>
          <button>Delete photo</button>
        </div>
      </div>
      <div>
        Name
        <input type="text"/>
        Bio
        <input type="text"/>
      </div>
    </div>
  )
}

export default Profile
