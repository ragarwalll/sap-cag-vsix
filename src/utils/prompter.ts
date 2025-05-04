import {
    type ChoiceOps,
    type UserInputMetadataConfirm,
    type UserInputMetadataList,
} from '@ragarwal06/sap-cloud-application-generator-types';
import { window } from 'vscode';
import { UNKNOW_ERROR_OCCURED } from './constants/message';

export const promptList = async (metadataList: UserInputMetadataList) => {
    const { list, message } = metadataList;

    const result = await window.showInformationMessage(
        message,
        ...list.map((item: ChoiceOps) => item.name),
    );

    const choice = list.find((item: ChoiceOps) => item.name === result);
    if (!choice) {
        await window.showErrorMessage(UNKNOW_ERROR_OCCURED);
    }
    return choice?.value;
};

export const promptConfirm = async (
    metadataConfirm: UserInputMetadataConfirm,
) => {
    const result = await window.showInformationMessage(
        metadataConfirm.message,
        'Yes',
        'No',
    );
    if (!result) { return metadataConfirm.confirm; };
    return result === 'Yes';
};
