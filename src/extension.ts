import * as dotenv from "dotenv";
dotenv.config();

import * as vscode from "vscode";
import { saveEvent } from "./utils/saveEvent";
import { getUserInfo } from "./utils/getUserInfo";

// Listeners
import { registerTypingListener } from "./listeners/registerTypingListener";
import { registerClipboardListener } from "./listeners/registerClipboardListener";
import { registerFileListener } from "./listeners/registerFileListener";
import { registerTerminalListener } from "./listeners/registerTerminalListener";
import { registerMouseListener } from "./listeners/registerMouseListener";
import { registerIdleListener } from "./listeners/registerIdleListener";
import { registerExtensionInstallListener } from "./listeners/registerExtensionInstallListener";

// ✅ Performance Monitor
import { startMemoryMonitor } from "./utils/performanceMonitor";

console.log("🚀 VSCode Activity Tracker extension loaded");

export async function activate(context: vscode.ExtensionContext) {
  console.log("✅ vscode-activity-tracker activated!");

  const user = await getUserInfo();

  // ✅ Start memory monitoring
  const stopMonitoring = startMemoryMonitor();
  context.subscriptions.push({ dispose: stopMonitoring });

  // 🧪 Performance Testing Logs
  console.log("Starting Performance Testing Logs...");
  console.log(" [LOAD TEST] Ready to test: Copy/Paste large files");
  console.log(" [PERFORMANCE TEST] Ready to measure CPU on code generation");
  console.log(" [PERFORMANCE TEST] Ready to test typing performance");

  registerTypingListener(context, user);
  registerClipboardListener(context, user);
  registerFileListener(context, user);
  registerTerminalListener(context, user);
  registerMouseListener(context, user);
  registerIdleListener(context, user);
  registerExtensionInstallListener(context, user);

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      const event = {
        eventType: "file",
        timestamp: new Date().toISOString(),
        user,
        filePath: document.fileName,
        metrics: {
          operation: "open",
        },
      };
      console.log("📂 Opened file:", document.fileName);
      saveEvent(event);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      const event = {
        eventType: "file",
        timestamp: new Date().toISOString(),
        user,
        filePath: document.fileName,
        metrics: {
          operation: "close",
        },
      };
      console.log("❌ Closed file:", document.fileName);
      saveEvent(event);
    })
  );

  const disposable = vscode.commands.registerCommand(
    "vscode-activity-tracker.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello from activity tracker!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
