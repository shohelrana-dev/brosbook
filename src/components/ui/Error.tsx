type Props = { message?: string; isError?: boolean }

export default function Error({ isError = true, message }: Props) {
   if (!isError) return null

   return <div className="bg-danger p-4">{message ? message : 'An error has occured!'}</div>
}
