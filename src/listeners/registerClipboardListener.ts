import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerClipboardListener(context: vscode.ExtensionContext) {
 const copyDisposable = vscode.commands.registerCommand("vscode-activity-tracker.copy", async () => {
  const editor = vscode.window.activeTextEditor;
  const text = editor?.document.getText(editor.selection) || "";
  const fileName = editor?.document.fileName || "Unknown";

  console.log("📋 Copied from:", fileName);

  await saveEvent({
    type: "copyPaste",
    action: "copy",
    characterCount: text.length,
    timestamp: new Date().toISOString()
  });

  await vscode.commands.executeCommand("editor.action.clipboardCopyAction");
});

const pasteDisposable = vscode.commands.registerCommand("vscode-activity-tracker.paste", async () => {
  const editor = vscode.window.activeTextEditor;
  const fileName = editor?.document.fileName || "Unknown";

  console.log("📋 Pasted into:", fileName);

  await saveEvent({
    type: "copyPaste",
    action: "paste",
    characterCount: 0,
    timestamp: new Date().toISOString()
  });

  await vscode.commands.executeCommand("editor.action.clipboardPasteAction");
});

  context.subscriptions.push(copyDisposable, pasteDisposable);
}
