import {
    type Disposable,
    type Webview,
    type WebviewPanel,
    window,
    Uri,
    env,
    ViewColumn,
} from 'vscode';
import { getUri } from '../utils/getUri';
import { getNonce } from '../utils/getNonce';
import { prepareDirectoryForPackages } from '../scaffold';
import { type Boilerplate } from '@ragarwal06/sap-cloud-application-generator-types';

/**
 * This class manages the state and behavior of ReactPanel webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering ReactPanel webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class ReactPanel {
    public static currentPanel: ReactPanel | undefined;
    private readonly _panel: WebviewPanel;
    private static readonly viewType = 'react';
    private _disposables: Disposable[] = [];

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(
            this._panel.webview,
            extensionUri,
        );

        // set the icons
        this._panel.iconPath = Uri.joinPath(extensionUri, 'assets', 'logo.png');

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri) {
        if (ReactPanel.currentPanel) {
            // If the webview panel already exists reveal it
            ReactPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                ReactPanel.viewType,
                // Panel title
                'SAP Cloud Applications Generator',
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Persit state when reset
                    retainContextWhenHidden: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [
                        Uri.joinPath(extensionUri, 'assets'),
                        Uri.joinPath(extensionUri, 'out'),
                        Uri.joinPath(extensionUri, 'webview-ui/build'),
                    ],
                },
            );

            ReactPanel.currentPanel = new ReactPanel(panel, extensionUri);
        }
    }

    public dispose() {
        ReactPanel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // The CSS file from the React build output
        const stylesUri = getUri(webview, extensionUri, [
            'webview-ui',
            'build',
            'main.css',
        ]);
        // The JS file from the React build output
        const scriptUri = getUri(webview, extensionUri, [
            'webview-ui',
            'build',
            'main.js',
        ]);

        const nonce = getNonce();
        const onDiskPath = Uri.joinPath(extensionUri, 'assets', 'logo.png');
        const favicon = webview.asWebviewUri(onDiskPath);

        const dataUri = webview.asWebviewUri(
            Uri.joinPath(extensionUri, 'images'),
        );

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <link rel="shortcut icon" type="image/x-icon" href="${favicon}" />
          <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'none'; img-src ${webview.cspSource} https: data:; script-src ${webview.cspSource}; style-src ${webview.cspSource};"
                />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>SAP Cloud Application Generator</title>
        </head>
        <body>
          <input hidden data-uri="${dataUri}">
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }

    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            async (message: any) => {
                const { command, data } = message;

                switch (command) {
                    case 'generate':
                        await prepareDirectoryForPackages(data as Boilerplate);
                        return;
                    case 'openExternal':
                        // Open the URL in the default browser
                        const url = data as string;
                        await env.openExternal(Uri.parse(url));
                        return;
                }
            },
            undefined,
            this._disposables,
        );
    }
}
