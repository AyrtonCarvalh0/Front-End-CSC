export default function Badge({ children, color = 'default' }) {
  const colors = {
    default: 'bg-bg-card text-gray-400 border-dim',
    success: 'bg-success/10 text-success border-success/20',
    danger:  'bg-danger/10  text-danger  border-danger/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    accent:  'bg-accent/10  text-accent  border-accent/20',
    purple:  'bg-purple/10  text-purple  border-purple/20',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
