import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { searchUserByName } from '../utils/searchUserByName'
import { Autocomplete, Avatar, TextField, debounce } from '@mui/material'
import { User } from '../types/auth-context'
import { getUserPhoto } from '../utils/getUserPhoto'

interface UserSearchProps {
  onUserChanged?: (user: User | null) => void
}

const UserSearch: FunctionComponent<UserSearchProps> = ({ onUserChanged }) => {
  const [options, setOptions] = useState<readonly User[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [value, setValue] = useState<User | null>(null)

  const searchUser = async (searchText: string) => {
    const users = await searchUserByName(searchText)
    setOptions(users)
  }

  const searchUserDebounced = useMemo(
    () => debounce((searchText: string) => searchUser(searchText), 400),
    []
  )

  useEffect(() => {
    searchUserDebounced(inputValue)
    return () => searchUserDebounced.clear()
  }, [inputValue, searchUserDebounced])

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) => option.name}
      options={options}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText='No users'
      isOptionEqualToValue={(option, value) => option.$id === value.$id}
      value={value}
      onChange={(event, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setValue(newValue)
        console.log('User was selected', newValue)

        if (onUserChanged) onUserChanged(newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => (
        <TextField {...params} label='Search' fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Avatar src={getUserPhoto(option) ?? ''}>
              {option.name.slice(0, 1)}
            </Avatar>
            {option.name}
          </li>
        )
      }}
    />
  )
}

export default UserSearch
