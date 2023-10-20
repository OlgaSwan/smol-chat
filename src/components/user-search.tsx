import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { searchUserByName } from '../utils/searchUserByName'
import { getUserPhoto } from '../utils/getUserPhoto'

import { User } from '../types/user'
import { Autocomplete, Avatar, TextField, debounce } from '@mui/material'

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
      sx={{
        width: 300,
        display: 'inline-block',
        border: 'solid 1px rgba(40, 41, 57, 1)',
        borderRadius: '5px',
        '& input': {
          width: 200,
          color: 'white',
          borderRadius: '5px',
        },
      }}
      getOptionLabel={(option) => option.name}
      options={options}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText='No users'
      isOptionEqualToValue={(option, value) => option.$id === value.$id}
      value={value}
      onChange={(_event, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setValue(newValue)

        if (onUserChanged) onUserChanged(newValue)
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            style: { color: '#c7d8eb', fontFamily: 'Segoe UI' },
          }}
          label='Search'
          fullWidth
        />
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
