import { ReactNode } from 'react'

interface Props {
   children?: ReactNode
   title: string
}

export default function WidgetLayout({ children, title }: Props) {
   return (
      <div className="card p-5 mb-6">
         <h2 className="text-xl font-medium mb-5">{title}</h2>

         {children}
      </div>
   )
}
