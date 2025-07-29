import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerFileListener(context: vscode.ExtensionContext) {
  const openDisposable = vscode.workspace.onDidOpenTextDocument(async (document) => {
    await saveEvent({
      type: "file",
      operation: "open",
      filePath: document.fileName,
      timestamp: new Date().toISOString(),
    });
  });

  const closeDisposable = vscode.workspace.onDidCloseTextDocument(async (document) => {
    await saveEvent({
      type: "file",
      operation: "close",
      filePath: document.fileName,
      timestamp: new Date().toISOString(),
    });
  });

  const saveDisposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    console.log("💾 File saved:", document.fileName);
    await saveEvent({
      type: "file",
      operation: "save",
      filePath: document.fileName,
      timestamp: new Date().toISOString(),
    });
  });

  context.subscriptions.push(openDisposable, closeDisposable, saveDisposable);
}
