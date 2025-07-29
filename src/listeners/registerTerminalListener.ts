import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerTerminalListener(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.onDidOpenTerminal(async (terminal) => {
      const event = {
        type: "terminal",
        command: `Opened terminal: ${terminal.name}`,
        timestamp: new Date().toISOString(),
      };
      console.log("[Terminal Opened]", event);
      await saveEvent(event);
    }),

    vscode.window.onDidCloseTerminal(async (terminal) => {
      const event = {
        type: "terminal",
        command: `Closed terminal: ${terminal.name}`,
        timestamp: new Date().toISOString(),
      };
      console.log("[Terminal Closed]", event);
      await saveEvent(event);
    })
  );
}
