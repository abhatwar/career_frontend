export default function LoadingSpinner({ fullScreen = true }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  );
}
