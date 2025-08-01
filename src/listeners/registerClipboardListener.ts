import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerClipboardListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  const copyDisposable = vscode.commands.registerCommand("vscode-activity-tracker.copy", async () => {
    const editor = vscode.window.activeTextEditor;
    const text = editor?.document.getText(editor.selection) || "";
    const fileName = editor?.document.fileName;

    console.log("📋 Copied from:", fileName);

    await saveEvent({
      eventType: "copyPaste",
      timestamp: new Date().toISOString(),
      user,
      filePath: fileName,
      metrics: {
        action: "copy",
        characterCount: text.length
      }
    });

    await vscode.commands.executeCommand("editor.action.clipboardCopyAction");
  });

  const pasteDisposable = vscode.commands.registerCommand("vscode-activity-tracker.paste", async () => {
    const editor = vscode.window.activeTextEditor;
    const fileName = editor?.document.fileName;

    console.log("📋 Pasted into:", fileName);

    await saveEvent({
      eventType: "copyPaste",
      timestamp: new Date().toISOString(),
      user,
      filePath: fileName,
      metrics: {
        action: "paste",
        characterCount: 0
      }
    });

    await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
  });

  context.subscriptions.push(copyDisposable, pasteDisposable);
}
