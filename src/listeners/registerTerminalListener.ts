import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

export function registerTerminalListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  // When a terminal is created
  context.subscriptions.push(
    vscode.window.onDidOpenTerminal((terminal) => {
      const event = {
        eventType: "terminal",
        timestamp: new Date().toISOString(),
        user,
        metrics: {
          command: `Terminal opened: ${terminal.name}`
        }
      };
      saveEvent(event);
    })
  );

  // ✅ When a terminal is closed
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((terminal) => {
      const event = {
        eventType: "terminal",
        timestamp: new Date().toISOString(),
        user,
        metrics: {
          command: `Terminal closed: ${terminal.name}`
        }
      };
      saveEvent(event);
    })
  );

  // If needed: listen to terminal commands if custom terminals are used
}
