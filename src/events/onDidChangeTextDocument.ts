//onDidChangeTextDocument.ts
import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";
import { on } from "events";

export function registerTypingListener(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      const textChanges = event.contentChanges.map(change => change.text).join(" ");
      const wordCount = textChanges.trim().split(/\s+/).filter(Boolean).length;
      const charCount = textChanges.length;
      const lineCount = textChanges.split("\n").length;

      const payload = {
        type: "typing",
        languageId: event.document.languageId,
        characters: charCount,
        words: wordCount,
        lines: lineCount,
        timestamp: new Date().toISOString(),
      };

      await saveEvent(payload);
    })
  );
}
