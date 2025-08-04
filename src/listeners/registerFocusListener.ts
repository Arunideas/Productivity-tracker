// src/listeners/registerFocusListener.ts
import * as vscode from "vscode";
import { saveEvent } from "../utils/saveEvent";

let lastBlurTime: Date | null = null;

export function registerFocusListener(
  context: vscode.ExtensionContext,
  user: { id: string; ip: string }
) {
  const handleBlur = () => {
    lastBlurTime = new Date();

    console.log("🔕 VS Code lost focus at:", lastBlurTime.toISOString());

    // Optional: Save immediate blur event
    saveEvent({
      eventType: "focus",
      timestamp: lastBlurTime.toISOString(),
      user,
      metrics: {
        state: "blur",
        durationSeconds: 0 // unknown yet
      }
    });
  };

  const handleFocus = () => {
    const focusTime = new Date();
    let durationSeconds = 0;

    if (lastBlurTime) {
      durationSeconds = Math.floor((focusTime.getTime() - lastBlurTime.getTime()) / 1000);
    }

    console.log("🔔 VS Code regained focus at:", focusTime.toISOString(), "| Out of focus for:", durationSeconds, "s");

    saveEvent({
      eventType: "focus",
      timestamp: focusTime.toISOString(),
      user,
      metrics: {
        state: "focus",
        durationSeconds
      }
    });

    lastBlurTime = null; // reset
  };

  const blurDisposable = vscode.window.onDidChangeWindowState((e) => {
    if (!e.focused) handleBlur();
    else handleFocus();
  });

  context.subscriptions.push(blurDisposable);
}
