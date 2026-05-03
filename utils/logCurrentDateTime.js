export function logCurrentDateTime(message = "Current Time") {
  const now = new Date();

  const formatted = now.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`🕒 ${message}: ${formatted}`);
}