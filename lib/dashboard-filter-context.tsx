'use client'

import { createContext, useContext, type ReactNode } from 'react'

interface DashboardFilterContextValue {
  dateRange: string
  channel?: string
}

const DashboardFilterContext = createContext<DashboardFilterContextValue>({
  dateRange: 'Last 30 Days',
})

export function DashboardFilterProvider({
  dateRange,
  channel,
  children,
}: DashboardFilterContextValue & { children: ReactNode }) {
  return (
    <DashboardFilterContext.Provider value={{ dateRange, channel }}>
      {children}
    </DashboardFilterContext.Provider>
  )
}

export function useDashboardFilters() {
  return useContext(DashboardFilterContext)
}
