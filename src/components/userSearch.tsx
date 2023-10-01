import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { searchUserByName } from '../utils/searchUserByName'
import { Autocomplete, Avatar, TextField, debounce } from '@mui/material'
import { User } from '../types/auth-context'
import { getUserPhoto } from '../utils/getUserPhoto'

const UserSearch: FunctionComponent = () => {
  const [options, setOptions] = useState<readonly User[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [value, setValue] = useState<User | null>(null)

  const handleTextChanged = async (searchText: string) => {
    const users = await searchUserByName(searchText)
    console.log(users)
    setOptions(users)
  }

  const fetch = useMemo(
    () => debounce((searchText: string) => handleTextChanged(searchText), 400),
    []
  )

  useEffect(() => {
    fetch(inputValue)
    return () => fetch.clear()
  }, [inputValue, fetch])

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) => option.$id}
      options={options}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText='No users'
      value={value}
      onChange={(event, newValue: User | null) => {
        setOptions(newValue ? [newValue, ...options] : options)
        setValue(newValue)
        console.log('User was selected', newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => (
        <TextField {...params} label='Search' fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <>
            <Avatar src={getUserPhoto(option) ?? ''}>
              {option.name.slice(0, 1)}
            </Avatar>
            {option.name}
          </>
        )
      }}
    />
  )
}

export default UserSearch
