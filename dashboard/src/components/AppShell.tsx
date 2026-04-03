import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

type Props = {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
