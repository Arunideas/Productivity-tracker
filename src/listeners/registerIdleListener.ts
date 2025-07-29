import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let lastActivityTime = Date.now();
let idleTimer: NodeJS.Timeout | null = null;
const IDLE_THRESHOLD_MS = 5000;

let isIdle = false;

export function registerIdleListener(context: vscode.ExtensionContext) {
  const onUserActivity = async () => {
    const now = Date.now();
    const idleDuration = now - lastActivityTime;

    if (isIdle && idleDuration >= IDLE_THRESHOLD_MS) {
      console.log("🖱️ Activity detected after idle");

      // Optionally log a "resume" event (uncomment if you want to save it too)
      // await saveEvent({
      //   type: "resume",
      //   timestamp: new Date().toISOString(),
      // });
    }

    // If previously idle, reset
    isIdle = false;
    lastActivityTime = now;

    // Restart the idle timer
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(checkIdleStatus, IDLE_THRESHOLD_MS + 1000);
  };

  const checkIdleStatus = async () => {
    const now = Date.now();
    const idleDuration = now - lastActivityTime;

    if (idleDuration >= IDLE_THRESHOLD_MS && !isIdle) {
      isIdle = true;
      const idleEvent = {
        type: "idle",
        durationSeconds: Math.floor(idleDuration / 1000),
        timestamp: new Date().toISOString(),
      };
      console.log("💤 Idle Detected:", idleEvent);
      await saveEvent(idleEvent);
    }

    // Continue checking
    idleTimer = setTimeout(checkIdleStatus, IDLE_THRESHOLD_MS + 1000);
  };

  // Reset on interaction
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(onUserActivity),
    vscode.window.onDidChangeTextEditorSelection(onUserActivity),
    vscode.workspace.onDidOpenTextDocument(onUserActivity),
    vscode.window.onDidChangeActiveTextEditor(onUserActivity)
  );

  // Start the timer
  idleTimer = setTimeout(checkIdleStatus, IDLE_THRESHOLD_MS + 1000);
}
