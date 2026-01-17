export default function GlassCard({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
