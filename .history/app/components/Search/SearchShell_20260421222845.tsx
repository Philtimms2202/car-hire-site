export default function SearchShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black"
      role="search"
      aria-label="Travel search"
    >
      {children}
    </div>
  )
}