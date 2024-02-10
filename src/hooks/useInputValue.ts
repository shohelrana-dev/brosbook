import { ChangeEvent, useState } from 'react'

export default function useInputValue(initialValue: string): [string, (e: any) => void, () => void] {
   const [value, setValue] = useState(initialValue)

   function handleChange(event: ChangeEvent<any>) {
      setValue(event?.target?.value || '')
   }

   function reset() {
      setValue('')
   }

   return [value, handleChange, reset]
}
