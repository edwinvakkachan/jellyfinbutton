export async function logTime(message = "⌚") {
  try {
    const res = await fetch(
      "https://worldtimeapi.org/api/timezone/Asia/Kolkata"
    );

    const data = await res.json();

    const time = new Date(data.datetime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });

    console.log(`${message} Monitoring started ${time}`);
  } catch (err) {
    console.error("Failed to fetch external time:", err);
  }
}