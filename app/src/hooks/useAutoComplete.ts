import { BaseEntity } from '@Ma'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { BaseLeanCloudRepository } from '@/src/repositories/baseRepository'

type Option<T> = { label: string; value: T }

const useAutoComplete = <T extends BaseEntity>(
  repo: BaseLeanCloudRepository<T>,
  fieldKey: keyof T,
  rowsLimit = 10,
  debounceMs = 500
): [
  Option<T>[],
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>,
  React.Dispatch<React.SetStateAction<string>>
] => {
  const [options, setOptions] = useState<Option<T>[]>([])
  const [selectedOption, setSelectedOption] = useState<T>()
  const [keyword, setKeyword] = useState('')

  useDebounce(
    () => {
      if (keyword) {
        repo
          .getPagingList(rowsLimit, 0, (query) => {
            query.contains(fieldKey.toString(), keyword)
            query.ascending(fieldKey.toString())
          })
          .then(({ data }) => {
            setOptions(
              data.map((value) => {
                return {
                  label: value[fieldKey.toString()].toString(),
                  value,
                }
              })
            )
          })
      }
    },
    debounceMs,
    [keyword]
  )
  return [options, selectedOption, setSelectedOption, setKeyword]
}

export default useAutoComplete
