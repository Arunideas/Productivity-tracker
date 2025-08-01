import * as os from "os";

export async function getUserInfo() {
  try {
    const { publicIpv4 } = await import("public-ip");
    const ip = await publicIpv4();

    const username = os.userInfo().username;
    return {
      id: username || "unknown",
      ip: ip || "127.0.0.1"
    };
  } catch (error) {
    console.warn("⚠️ Failed to fetch public IP, using localhost:", error);
    return {
      id: os.userInfo().username || "unknown",
      ip: "127.0.0.1"
    };
  }
}
