import { Sidebar } from '@/components/dashboard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-waxe-deep text-[13px]">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden p-5 lg:p-6">
        {children}
      </main>
    </div>
  )
}
