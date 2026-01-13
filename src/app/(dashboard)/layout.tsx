export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo mode: no authentication required
  return <>{children}</>
}
