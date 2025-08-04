import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

const STORAGE_KEY = "trackedExtensions";

export function registerExtensionInstallListener(
  context: vscode.ExtensionContext,
  user: { id: string; ip: string }
) {
  let isFirstRun = false;

  const stored = context.globalState.get<[string, string][]>(STORAGE_KEY, []);
  let previousExtensions = new Map<string, string>(stored);

  if (stored.length === 0) {
    isFirstRun = true;
    console.log("🕒 First run: skipping install/uninstall detection");
  } else {
    console.log("🧩 Loaded", previousExtensions.size, "extensions from globalState");
  }

  const interval = setInterval(async () => {
    const currentExtensions = new Map<string, string>();
    vscode.extensions.all.forEach(ext => {
      currentExtensions.set(ext.id, ext.packageJSON.version || "unknown");
    });

    if (!isFirstRun) {
      const newlyInstalled: { id: string; version: string }[] = [];

      for (const [id, version] of currentExtensions.entries()) {
        if (!previousExtensions.has(id)) {
          newlyInstalled.push({ id, version });
        }
      }

      if (newlyInstalled.length > 0) {
        const parent = newlyInstalled[0]; // take only the first extension detected
        console.log("➕ Detected new install:", parent.id);

        await saveEvent({
          eventType: "extensionInstall",
          timestamp: new Date().toISOString(),
          user,
          metrics: {
            extensionId: parent.id,
            version: parent.version,
          },
        });

        // Optional: log remaining as dependencies
        // for (const ext of newlyInstalled.slice(1)) {
        //   console.log("📦 Skipped dependency install:", ext.id);
        // }
      }

      // ➖ Uninstalled extensions
      for (const id of previousExtensions.keys()) {
        if (!currentExtensions.has(id)) {
          console.log("➖ Detected uninstall:", id);
          await saveEvent({
            eventType: "extensionUninstall",
            timestamp: new Date().toISOString(),
            user,
            metrics: {
              extensionId: id,
            },
          });
        }
      }
    }

    // 💾 Save new state
    await context.globalState.update(STORAGE_KEY, Array.from(currentExtensions.entries()));
    previousExtensions = currentExtensions;
    isFirstRun = false;
  }, 10000); // every 10s

  context.subscriptions.push({ dispose: () => clearInterval(interval) });
}
