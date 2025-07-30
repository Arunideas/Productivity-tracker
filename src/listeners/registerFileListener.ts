import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerFileListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  const openDisposable = vscode.workspace.onDidOpenTextDocument(async (document) => {
    await saveEvent({
      eventType: "file",
      timestamp: new Date().toISOString(),
      user,
      filePath: document.fileName,
      metrics: {
        operation: "open"
      }
    });
  });

  const closeDisposable = vscode.workspace.onDidCloseTextDocument(async (document) => {
    await saveEvent({
      eventType: "file",
      timestamp: new Date().toISOString(),
      user,
      filePath: document.fileName,
      metrics: {
        operation: "close"
      }
    });
  });

  const saveDisposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    console.log("💾 File saved:", document.fileName);
    await saveEvent({
      eventType: "file",
      timestamp: new Date().toISOString(),
      user,
      filePath: document.fileName,
      metrics: {
        operation: "save"
      }
    });
  });

  context.subscriptions.push(openDisposable, closeDisposable, saveDisposable);
}
