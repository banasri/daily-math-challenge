export function getTodayString() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export function getTodayIST() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  }); // YYYY-MM-DD
}

export function getYesterdayIST() {
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split("T")[0]; // YYYY-MM-DD
}
