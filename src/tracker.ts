export async function sendActivity(data: any) {
  try {
    const response = await fetch("http://localhost:3000/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("❌ Failed to send activity:", await response.text());
    } else {
      console.log("✅ Activity sent successfully");
    }
  } catch (error) {
    console.error("❗ Error sending activity:", error);
  }
}
