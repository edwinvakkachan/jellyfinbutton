


export async function logTime(message='⌚') {
  const time = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false
  });
  console.log( `Monitoring started ${time} `);
}