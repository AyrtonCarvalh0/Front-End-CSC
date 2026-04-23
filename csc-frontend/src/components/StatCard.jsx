export default function StatCard({ label, value, icon: Icon, color = 'accent', sub }) {
  const colors = {
    accent:  'text-accent  bg-accent/10  border-accent/20',
    success: 'text-success bg-success/10 border-success/20',
    danger:  'text-danger  bg-danger/10  border-danger/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    purple:  'text-purple  bg-purple/10  border-purple/20',
  }

  return (
    <div className="bg-bg-secondary border border-dim rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg border ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  )
}
