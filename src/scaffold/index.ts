import {
    type Progress,
    ProgressLocation,
    commands,
    window,
    workspace,
} from 'vscode';
import {
    ABORTING_INSTALLTION,
    NO_PACKAGES_SELECTED,
    NO_WORSPACE_OPEN,
    SCAFFOLDING_PACKAGES,
} from '../utils/constants/message';
import { OPEN_FOLDER } from '../utils/constants/button';
import {
    generateProjectNameAndPath,
    checkIfIsEmpty,
    checkIfDirExists,
    clearDir,
    Scaffold,
} from '@ragarwal06/sap-cloud-application-generator';
import path from 'path';
import { promptConfirm, promptList } from '../utils/prompter';
import { getPkgRoot } from '../utils/getPkgRoot';
import {
    type Boilerplate,
    availableOverrideChoices,
    sureConfirm,
} from '@ragarwal06/sap-cloud-application-generator-types';

type ProgressMessage = Progress<{ message?: string }>;

export const prepareDirectoryForPackages = async (metadata: Boilerplate) => {
    if (Object.keys(metadata.packages).length === 0) {
        return await window.showErrorMessage(NO_PACKAGES_SELECTED);
    }

    // check if workspace is open
    let dummy;
    console.log(dummy);
    const rootPath = workspace.workspaceFolders?.[0].uri.fsPath;
    if (!rootPath) {
        const action = await window.showErrorMessage(
            NO_WORSPACE_OPEN,
            OPEN_FOLDER,
        );
        if (action === OPEN_FOLDER) {
            await commands.executeCommand('vscode.openFolder');
        }

        return;
    }

    const { path: projectDir, appName } = generateProjectNameAndPath(
        metadata.appName,
    );

    const projectDirectory = path.resolve(rootPath, projectDir);

    // starting scaffolding
    await window.withProgress(
        {
            location: ProgressLocation.Notification,
            title: `${appName}`,
            cancellable: false,
        },
        async (progress: ProgressMessage) => {
            progress.report({
                message: `${SCAFFOLDING_PACKAGES} ${appName}...`,
            });

            if (checkIfIsEmpty(projectDirectory)) {
                void window.showInformationMessage(
                    `folder with the same name ${appName} exists, continuing...`,
                );
            }
            else if (
                checkIfDirExists(projectDirectory) &&
                !checkIfIsEmpty(projectDirectory)
            ) {
                const contine = await askOverrideDirectory(
                    progress,
                    projectDirectory,
                    appName,
                );
                if (!contine) {
                    return;
                }
            }

            // scaffold
            return new Promise<void>((resolve, reject) => {
                try {
                    const scaffolder = new Scaffold(
                        metadata,
                        projectDirectory,
                        getPkgRoot('@ragarwal06/sap-cloud-application-generator'),
                    );
                    scaffolder.on('msg', (data: string) => {
                        onDataHandler(data, progress);
                    });
                    scaffolder.on('error', (data: string) => {
                        void window.showErrorMessage(data);
                        reject();
                    });
                    scaffolder.on('end', (data: string) => {
                        void window.showInformationMessage(data);
                        resolve();
                    });
                    dummy = scaffolder.start();
                } catch (e: any) {
                    void window.showErrorMessage(
                        `Error occoured while scaffolding ${e.message}`,
                    );
                    reject();
                }
            });
        },
    );
};

const askOverrideDirectory = async (
    progress: ProgressMessage,
    projectDirectory: string,
    appName: string,
) => {
    const userInput = await promptList(availableOverrideChoices);
    if (userInput === 'abort') {
        void window.showErrorMessage(ABORTING_INSTALLTION);
        return Promise.resolve(false);
    }

    // ask user if they are sure
    const userConfirm = await promptConfirm(sureConfirm);
    if (!userConfirm) {
        void window.showErrorMessage(ABORTING_INSTALLTION);
        return Promise.resolve(false);
    }

    progress.report({
        message: `Cool 👍! Cleaning the folder & continuing installation!`,
    });
    clearDir(projectDirectory);
    progress.report({
        message: `${SCAFFOLDING_PACKAGES} ${appName}...`,
    });
    return Promise.resolve(true);
};

const onDataHandler = (data: string, progress: ProgressMessage) => {
    if (data === undefined) {
        return;
    }
    if (data.trim() === '') {
        return;
    }
    data = data.replace(/\n$/, '');
    progress.report({ message: data });
};
