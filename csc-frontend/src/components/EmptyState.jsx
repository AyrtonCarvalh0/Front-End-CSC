export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <Icon size={36} strokeWidth={1.2} className="mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
