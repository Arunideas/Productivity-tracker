import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let lastActivityTime = Date.now();
let idleTimer: NodeJS.Timeout | null = null;
const IDLE_THRESHOLD_MS = 60000; // 1 min
let isIdle = false;
let idleStart: number | null = null;

export function registerIdleListener(context: vscode.ExtensionContext, user: { id: string; ip: string }) {
  const onUserActivity = () => {
    const now = Date.now();

    if (isIdle && idleStart !== null) {
      const idleEnd = now;
      const duration = Math.floor((idleEnd - idleStart) / 1000);

      // Save idle event when user returns
      saveEvent({
        eventType: "idle",
        timestamp: new Date().toISOString(),
        user,
        metrics: {
          start: new Date(idleStart).toISOString(),
          end: new Date(idleEnd).toISOString(),
          durationSeconds: duration
        }
      });
    }

    isIdle = false;
    idleStart = null;
    lastActivityTime = now;

    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => checkIdleStatus(), IDLE_THRESHOLD_MS + 1000);
  };

  const checkIdleStatus = async () => {
    const now = Date.now();
    const idleDuration = now - lastActivityTime;

    if (idleDuration >= IDLE_THRESHOLD_MS && !isIdle) {
      isIdle = true;
      idleStart = lastActivityTime;
    }

    idleTimer = setTimeout(() => checkIdleStatus(), IDLE_THRESHOLD_MS + 1000);
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(onUserActivity),
    vscode.window.onDidChangeTextEditorSelection(onUserActivity),
    vscode.workspace.onDidOpenTextDocument(onUserActivity),
    vscode.window.onDidChangeActiveTextEditor(onUserActivity)
  );

  idleTimer = setTimeout(() => checkIdleStatus(), IDLE_THRESHOLD_MS + 1000);
}
