import {
    availableFlags,
    AvailableFlagsMap,
    AvailableFlagsType,
    Boilerplate,
    UserInputMetadataConfirm,
    UserInputMetadataOptions,
} from '@ragarwal06/sap-cloud-application-generator-types';
import {
    VscodeCheckbox,
    VscodeFormGroup,
    VscodeLabel,
    VscodeTextfield,
} from '@vscode-elements/react-elements';

interface MetadataGroupProps {
    data: Boilerplate;
    setData: React.Dispatch<React.SetStateAction<Boilerplate>>;
}

const MetadataGroup = ({ setData, data}: MetadataGroupProps) => {
    const handleDataChange = (e: Event, type: 'checkbox' | 'input') => {
        const target = e.target as HTMLInputElement;
        const flagName = target.dataset.flagName as AvailableFlagsType;

        const value = type === 'checkbox' ? target.checked : target.value;

        if (Object.keys(data).includes(flagName)) {
            setData((prev) => ({
                ...prev,
                [flagName]: value,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                flags: {
                    ...prev.flags,
                    [flagName]: value,
                },
            }));
        }
    };

    return (
        <div className='package-container'>
            <VscodeFormGroup variant='vertical'>
                {Object.keys(availableFlags).map((flag) => {
                    const flagData =
                        availableFlags[flag as keyof typeof availableFlags];
                    if (flagData.type !== 'input') return;
                    return (
                        <GlobalFlagsInput
                        metadata={data}
                            data={flagData}
                            flag={flag as keyof AvailableFlagsMap}
                            changeHandler={(e: Event) =>
                                handleDataChange(e, 'input')
                            }
                        />
                    );
                })}
            </VscodeFormGroup>

            <VscodeFormGroup variant='settings-group'>
                <VscodeLabel>
                    Please choose how would you like to build the project?
                </VscodeLabel>
                {Object.keys(availableFlags).map((flag) => {
                    const flagData =
                        availableFlags[flag as keyof typeof availableFlags];
                    if (flagData.type !== 'confirm') return;

                    return (
                        <GlobalFlagsCheckbox
                        metadata={data}
                            data={flagData as UserInputMetadataConfirm}
                            flag={flag as keyof AvailableFlagsMap}
                            changeHandler={(e: Event) =>
                                handleDataChange(e, 'checkbox')
                            }
                        />
                    );
                })}
            </VscodeFormGroup>
        </div>
    );
};

const GlobalFlagsInput = ({
    metadata,
    data,
    flag,
    changeHandler,
}: {
    metadata: Boilerplate;
    data: UserInputMetadataOptions;
    flag: AvailableFlagsType;
    changeHandler: (e: Event) => void;
}) => {
    let newName = flag as string;
    if (flag === 'version') return null;
    if (flag === 'name') newName = 'appName';
    const label = data.message === '' ? data.description : data.message;
    const currentValue = () => {
        if (Object.keys(metadata).includes(newName)) {
            return metadata[newName as keyof Boilerplate];
        }
        return metadata.flags[newName as keyof typeof metadata.flags];
    };
    const value = currentValue() as string;
    return (
        <div>
            <VscodeLabel htmlFor={newName + `input`}>{label}</VscodeLabel>
            <VscodeTextfield
                key={newName + `input`}
                onInput={changeHandler}
                value={value}
                data-flag-name={newName}
            ></VscodeTextfield>
        </div>
    );
};

const GlobalFlagsCheckbox = ({
    metadata,
    data,
    flag,
    changeHandler,
}: {
    metadata: Boilerplate;
    data: UserInputMetadataConfirm;
    flag: AvailableFlagsType;
    changeHandler: (e: Event) => void;
}) => {
    const label = data.message === '' ? data.description : data.message;
    const currentValue = () => {
        if (Object.keys(metadata).includes(flag)) {
            return metadata[flag as keyof Boilerplate];
        }
        return metadata.flags[flag as keyof typeof metadata.flags];
    }
    return (
        <div>
            <VscodeCheckbox
                key={flag + `checkbox`}
                checked={currentValue() as boolean}
                onChange={changeHandler}
                data-flag-name={flag}
            >
                {label}
            </VscodeCheckbox>
        </div>
    );
};

export default MetadataGroup;
