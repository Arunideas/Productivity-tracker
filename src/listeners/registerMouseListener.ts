import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let mouseStart: number | null = null;
let mouseTimeout: NodeJS.Timeout;

export function registerMouseListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async (e) => {
      const position = e.selections[0]?.active;
      const now = Date.now();

      if (!mouseStart) {
        mouseStart = now;
      }

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(async () => {
        const duration = Math.floor((Date.now() - mouseStart!) / 1000);

        if (position) {
          await saveEvent({
            eventType: "mouse",
            timestamp: new Date().toISOString(),
            user,
            filePath: e.textEditor.document.fileName,
            metrics: {
              x: position.line,
              y: position.character,
              context: "editor",
              start: new Date(mouseStart!).toISOString(),
              end: new Date().toISOString(),
              durationSeconds: duration
            }
          });
        }

        mouseStart = null;
      }, 3000); // Ends mouse session after 3s of inactivity
    })
  );
}
