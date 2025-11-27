export function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center p-8">
      <div className="bg-linear-to-r from-ctp-peach-400 to-ctp-green-400 flex flex-col items-center bg-clip-text font-medium text-transparent">
        <h1 className="text-6xl">404 not found</h1>
        <p className="text-2xl">What a disaster</p>
      </div>
    </main>
  );
}
