export default function StatCard({ label, value, icon: Icon, color = 'accent', sub }) {
  const bgColors = {
    accent:  'from-csc-blue to-blue-600',
    success: 'from-success to-green-600',
    danger:  'from-danger to-red-600',
    warning: 'from-csc-yellow to-amber-500',
    purple:  'from-purple to-violet-600',
  }

  return (
    <div className="bg-bg-secondary border border-white/5 rounded-2xl p-5
      flex items-start gap-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br
        ${bgColors[color]} shadow-md`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-500 uppercase
          tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-100
          tracking-tight">{value}</p>
        {sub && (
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{sub}</p>
        )}
      </div>
    </div>
  )
}
