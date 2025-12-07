export function NotFound() {
  return (
    <main class={"flex h-full flex-col items-center justify-center p-8"}>
      <div class={"flex flex-col items-center font-medium"}>
        <h1 class={"text-6xl"}>404</h1>
        <p class={"text-2xl"}>Page not found</p>
        <a href="/" class={"hover:text-accent mt-4 underline"}>
          Back to home page
        </a>
      </div>
    </main>
  );
}
