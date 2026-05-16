export default function Badge({ children, color = 'default' }) {
  const colors = {
    default: 'bg-white/5    text-gray-400 border-white/10',
    success: 'bg-success/10 text-success   border-success/20',
    danger:  'bg-danger/10  text-danger    border-danger/20',
    warning: 'bg-warning/10 text-warning   border-warning/20',
    accent:  'bg-csc-lightblue text-csc-blue border-csc-blue/20',
    purple:  'bg-purple/10  text-purple    border-purple/20',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5
      rounded-full text-xs border font-bold ${colors[color]}`}>
      {children}
    </span>
  )
}
