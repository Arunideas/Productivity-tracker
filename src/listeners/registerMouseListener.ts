import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerMouseListener(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async (e) => {
      const position = e.selections[0]?.active;

      if (position) {
        const event = {
          type: "mouse",
          action: "cursorMoved",
          fileName: e.textEditor.document.fileName,
          line: position.line,
          character: position.character,
          timestamp: new Date().toISOString(),
        };

        console.log("[Mouse Moved]", event);
        await saveEvent(event);
      }
    })
  );
}
