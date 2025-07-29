import * as dotenv from 'dotenv';
dotenv.config();

import * as vscode from "vscode";
import { saveEvent } from "./utils/saveEvent";

// Existing listeners
import { registerTypingListener } from "./listeners/registerTypingListener";
import { registerClipboardListener } from "./listeners/registerClipboardListener";
import { registerFileListener } from "./listeners/registerFileListener";
import { registerTerminalListener } from "./listeners/registerTerminalListener";
import { registerMouseListener } from "./listeners/registerMouseListener";

// ✅ New listeners
import { registerIdleListener } from "./listeners/registerIdleListener";
import { registerExtensionInstallListener } from "./listeners/registerExtensionInstallListener";
console.log("🚀 VSCode Activity Tracker extension activated");


export function activate(context: vscode.ExtensionContext) {
  console.log("✅ vscode-activity-tracker activated!");

  // Register all activity listeners
  registerTypingListener(context);
  registerClipboardListener(context);
  registerFileListener(context);
  registerTerminalListener(context);
  registerMouseListener(context);

  // ✅ Register new listeners
  registerIdleListener(context);
  registerExtensionInstallListener();

  // Track file open
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      console.log("📂 Opened file:", document.fileName);
      saveEvent({
        type: "file",
        operation: "open",
        filePath: document.fileName,
        timestamp: new Date().toISOString(),
      });
    })
  );

  // Track file close
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      console.log("❌ Closed file:", document.fileName);
      saveEvent({
        type: "file",
        operation: "close",
        filePath: document.fileName,
        timestamp: new Date().toISOString(),
      });
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
