import { Boilerplate, BoilerplateFlags } from '@ragarwal06/sap-cloud-application-generator-types';

export const setNewValueForObject = (
    prevValue: Boilerplate,
    newValue: unknown,
    propName: string,
) => {
    const propNames = propName.split('.');
    if (propNames.length === 1) return { ...prevValue, [propName]: newValue };
    else if (propNames.length === 2) {
        const val = {
            ...prevValue,
        };
        let nestedKey1 = val[
            propNames[0] as keyof Boilerplate
        ] as BoilerplateFlags;
        nestedKey1 = {
            ...nestedKey1,
            [propNames[1]!]: newValue,
        };
        return {
            ...val,
            [propNames[0] as keyof Boilerplate]: nestedKey1,
        };
    }
    return { ...prevValue };
};
