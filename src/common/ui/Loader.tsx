export function AuthLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50   max-w-[420px]  w-screen ">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}
