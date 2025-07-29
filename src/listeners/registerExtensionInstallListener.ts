import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let previousExtensionIds = new Set<string>();

export function registerExtensionInstallListener() {
  // Initial capture of installed extension IDs
  previousExtensionIds = new Set(
    vscode.extensions.all.map((ext) => ext.id)
  );

  console.log("🧩 Extension tracker initialized with", previousExtensionIds.size, "extensions.");

  // Poll every 10 seconds
  setInterval(async () => {
    console.log("🧪 Checking for extension install/uninstall...");

    const currentExtensions = vscode.extensions.all;
    const currentExtensionIds = new Set(currentExtensions.map((ext) => ext.id));

    // Find newly installed extensions
    const newExtensions = [...currentExtensionIds].filter((id) => !previousExtensionIds.has(id));
    for (const id of newExtensions) {
      console.log("🧩 Extension Installed:", id);
      await saveEvent({
        type: "extension",
        operation: "install",
        extensionId: id,
        timestamp: new Date().toISOString(),
      });
      vscode.window.showInformationMessage(`🧩 Extension Installed: ${id}`);
    }

    // Find uninstalled extensions
    const removedExtensions = [...previousExtensionIds].filter((id) => !currentExtensionIds.has(id));
    for (const id of removedExtensions) {
      console.log("❌ Extension Uninstalled:", id);
      await saveEvent({
        type: "extension",
        operation: "uninstall",
        extensionId: id,
        timestamp: new Date().toISOString(),
      });
      vscode.window.showInformationMessage(`❌ Extension Uninstalled: ${id}`);
    }

    // Update the reference set
    previousExtensionIds = currentExtensionIds;

  }, 10000); // every 10s
}
