# 🚀 VSCode Productivity Tracker

A **Visual Studio Code Extension** that tracks user activity to analyze productivity patterns.  
It logs multiple types of events (typing, file open/close, terminal usage, clipboard, mouse movements, idle time, and extension installs/uninstalls) and stores them in **MongoDB** for further analysis.  

---

## 📂 Project Structure
Productivity-tracker/
│
├── src/
│ ├── extension.ts # Main entry point, activates the extension
│ │
│ ├── listeners/ # Event listeners
│ │ ├── registerTypingListener.ts # Tracks typing events
│ │ ├── registerClipboardListener.ts# Tracks copy/paste events
│ │ ├── registerFileListener.ts # Tracks file open/close/save events
│ │ ├── registerTerminalListener.ts # Tracks terminal commands
│ │ ├── registerMouseListener.ts # Tracks mouse events
│ │ ├── registerIdleListener.ts # Tracks idle time
│ │ └── registerExtensionInstallListener.ts # Tracks extension install/uninstall events
│ │
│ ├── utils/
│ │ ├── saveEvent.ts # Validates and saves events to MongoDB
│ │ ├── mongoClient.ts # MongoDB connection logic
│ │ ├── eventSchemas.ts # Zod schemas for event validation
│ │ ├── getUserInfo.ts # Fetches user info (ID & IP)
│ │ └── performanceMonitor.ts # Monitors memory & CPU usage
│
├── package.json # Extension manifest
├── tsconfig.json # TypeScript configuration
├── README.md # Project documentation
└── .vscodeignore # Files to ignore while packaging
## ✨ Features

✅ **Typing Tracking** – Captures characters, words, lines, and active file paths  
✅ **File Tracking** – Logs open, close, and save events  
✅ **Clipboard Tracking** – Detects copy/paste actions  
✅ **Terminal Tracking** – Records executed terminal commands  
✅ **Mouse Tracking** – Captures mouse movement coordinates and context  
✅ **Idle Time Tracking** – Detects inactivity duration  
✅ **Extension Install/Uninstall Tracking** – Monitors VSCode extension changes  
✅ **MongoDB Integration** – All events stored securely for analysis  
✅ **Performance Monitoring** – Tracks CPU and Memory usage to ensure stability  

---

## 🛠️ Tech Stack

- **Language**: TypeScript  
- **Framework**: VSCode Extension API  
- **Database**: MongoDB (Cloud/Atlas)  
- **Validation**: Zod Schemas  
- **Tools**: VSCE, Git, Node.js  

---

## 🚀 Installation

1️⃣ Clone the repository:
```bash
git clone <your-fork-url>
cd Productivity-tracker

Install dependencies:
npm install

Build the extension:
npm run compile

Package into .vsix:
vsce package

 Install in VSCode:

Open VSCode

Go to Extensions > Install from VSIX

Select the generated .vsix file

Run in Extension Host:

npm run compile
code .
# Press F5 to launch in Extension Development Host

