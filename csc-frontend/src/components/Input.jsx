export default function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 mb-1.5">{label}</label>}
      <input
        className="w-full bg-bg-card border border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-accent/50 transition-colors placeholder-gray-600"
        {...props}
      />
    </div>
  )
}
