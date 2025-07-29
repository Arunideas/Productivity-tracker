import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerTypingListener(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      if (event.contentChanges.length === 0) return;

      const textChanges = event.contentChanges.map((change) => change.text).join(" ");
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
        userId: process.env.USER || "unknown",
        ipAddress: "127.0.0.1",
        filePath: event.document.fileName,
        lineNumbers: event.contentChanges.map((change) => change.range.start.line),
        wordCount: wordCount,
        lineCount: lineCount,
      };

      console.log("⌨️ Typing event:", payload);
      await saveEvent(payload);
    })
  );
}
