import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let previousExtensionIds = new Set<string>();

export function registerExtensionInstallListener(
  context: vscode.ExtensionContext,
  user: { id: string; ip: string }
) {
  previousExtensionIds = new Set(vscode.extensions.all.map(ext => ext.id));
  console.log("🧩 Extension tracker initialized with", previousExtensionIds.size, "extensions.");

  const interval = setInterval(async () => {
    const currentExtensions = vscode.extensions.all;
    const currentExtensionIds = new Set(currentExtensions.map(ext => ext.id));

    // 🟢 Detect newly installed extensions
    const newExtensions = [...currentExtensionIds].filter(id => !previousExtensionIds.has(id));
    for (const id of newExtensions) {
      const ext = currentExtensions.find(e => e.id === id);
      await saveEvent({
        eventType: "extensionInstall",
        timestamp: new Date().toISOString(),
        user,
        metrics: {
          extensionId: id,
          version: ext?.packageJSON?.version || "unknown"
        }
      });
    }

    // 🔴 Detect uninstalled extensions
    const removedExtensions = [...previousExtensionIds].filter(id => !currentExtensionIds.has(id));
    for (const id of removedExtensions) {
      await saveEvent({
        eventType: "extensionUninstall",
        timestamp: new Date().toISOString(),
        user,
        metrics: {
          extensionId: id
        }
      });
    }

    previousExtensionIds = currentExtensionIds;
  }, 10000);

  context.subscriptions.push({ dispose: () => clearInterval(interval) });
}
