import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let typingStart: number | null = null;
let typingTimeout: NodeJS.Timeout;

export function registerTypingListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      if (event.contentChanges.length === 0) return;

      // Track typing start
      if (!typingStart) {
        typingStart = Date.now();
      }

      // Reset debounce timer
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(async () => {
        const typingEnd = Date.now();
        const duration = Math.floor((typingEnd - typingStart!) / 1000);

        const textChanges = event.contentChanges.map((change) => change.text).join(" ");
        const wordCount = textChanges.trim().split(/\s+/).filter(Boolean).length;
        const charCount = textChanges.length;
        const lineCount = textChanges.split("\n").length;

        await saveEvent({
          eventType: "typing",
          timestamp: new Date().toISOString(),
          user,
          filePath: event.document.fileName,
          metrics: {
            languageId: event.document.languageId,
            characters: charCount,
            words: wordCount,
            lines: lineCount,
            lineNumbers: event.contentChanges.map(change => change.range.start.line),
            start: new Date(typingStart!).toISOString(),
            end: new Date(typingEnd).toISOString(),
            durationSeconds: duration
          }
        });

        typingStart = null;
      }, 3000); // Session ends after 3s idle
    })
  );
}
