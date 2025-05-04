# SAP Cloud Application Generator

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

VS Code extension that scaffolds full-stack SAP apps on SAP Business Technology Platform (BTP) with a single command.

---

## 🚀 Features

- Generates a complete frontend/backend codebase  
- Includes UI5, React, Spring Boot or Node.js templates  
- Auto-configures local run/debug & deployment descriptors  
- Centralized generator logic, extensible via API or CLI  
- Reduces project bootstrap from days to minutes  
- Out-of-the-box support for common SAP BTP services  

---

## 🎯 Getting Started

### Prerequisites

- VS Code ≥ 1.46.0  
- Node.js ≥ 14.19  
- (Optional) SAP BTP CLI & cf CLI if you plan to deploy  

### Install the Extension

1. Open VS Code  
2. Go to **Extensions** (⇧⌘X / Ctrl+Shift+X)  
3. Search for **SAP Cloud Application Generator**  
4. Click **Install**

---

## ⚙️ Usage

1. Open the Command Palette  
   - Windows/Linux: `Ctrl+Shift+P`  
   - macOS: `⌘+Shift+P`  
2. Run **SAP Cloud Applications: Generate**  
3. Fill in project details:
   - Application name, namespace, package type  
   - Frontend framework (UI5/React)  
   - Backend (Spring Boot/Node.js)  
   - Additional SAP BTP services  
4. Review & adjust the suggested dependencies  
5. Click **Generate**  

Your new project will be created in a folder you choose, complete with:
- `package.json` or `pom.xml`  
- UI5/React app scaffold  
- Spring Boot or Node.js backend  
- `.vscode/launch.json` & `.vscode/tasks.json`  
- Deployment descriptors (`mta.yaml`, `xs-app.json`, etc.)  

---

## 📦 Extension Commands

| Command                                   | Description                                |
|-------------------------------------------|--------------------------------------------|
| `SAP Cloud Applications: Generate`        | Launch the project scaffolding wizard      |

---

## 🛠️ Contributing

1. Fork the repo: `git clone https://github.com/ragarwalll/sap-cloud-application-generator-vsix.`  
2. Install dependencies: `npm i`  
3. Start the webview UI in dev mode:  
   ```bash
   cd webview-ui
   npm run dev
