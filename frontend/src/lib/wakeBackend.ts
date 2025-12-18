export async function wakeBackend() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return;

  try {
    await fetch(apiUrl, { method: "GET" });
  } catch {
    // ignore errors (backend sleeping)
  }
}
