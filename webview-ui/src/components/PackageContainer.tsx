// src/components/PackageContainer.tsx
import React, { FC, useCallback } from 'react';
import {
    AvailableBackendPackagesMap,
    AvailableFrontendPackagesMap,
    PackageMetadata,
} from '@ragarwal06/sap-cloud-application-generator-types';
import {
    VscodeFormGroup,
    VscodeFormHelper,
    VscodeLabel,
    VscodeOption,
    VscodeSingleSelect,
    VscodeTextfield,
} from '@vscode-elements/react-elements';

interface Props {
    availablePackages?:
        | AvailableFrontendPackagesMap
        | AvailableBackendPackagesMap;
    selected: PackageMetadata | null;
    setSelectedPackage: React.Dispatch<
        React.SetStateAction<PackageMetadata | null>
    >;
}

const PackageContainer: FC<Props> = ({
    availablePackages,
    selected,
    setSelectedPackage,
}) => {
    const handleSelectChange = useCallback(
        (e: Event) => {
            const target = e.target as HTMLSelectElement;
            const val = target.value;
            if (val === 'Skip') {
                setSelectedPackage(null);
                return;
            }
            const pkg = Object.values(availablePackages || {}).find(
                (p) => p.displayName === val,
            );
            setSelectedPackage(pkg || null);
        },
        [availablePackages, setSelectedPackage],
    );

    const handleValueChange = useCallback(
        (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.dataset.packageField;
            if (!field || !selected) return;
            setSelectedPackage({
                ...selected,
                metadata: {
                    ...selected.metadata,
                    [field]: {
                        ...selected.metadata[field],
                        value: target.value,
                    },
                },
            });
        },
        [selected, setSelectedPackage],
    );

    return (
        <div className='package-container'>
            <VscodeFormGroup variant='vertical'>
                <VscodeLabel htmlFor={`${selected?.type}-package`}>
                    Please select the {selected?.type || ''} package
                </VscodeLabel>
                <VscodeSingleSelect
                    id={`${selected?.type}-package`}
                    onChange={handleSelectChange}
                    required
                >
                    {Object.values(availablePackages || {}).map((pkg) => (
                        <VscodeOption
                            key={pkg.packageName}
                            className={pkg.className}
                        >
                            {pkg.displayName}
                        </VscodeOption>
                    ))}
                    <VscodeOption>Skip</VscodeOption>
                </VscodeSingleSelect>
                <VscodeFormHelper>
                    <p>
                        You can read more about the available packages{' '}
                        <a
                            href='https://therahulagarwal.com/sap-cloud-application-generator'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            here
                        </a>
                    </p>
                </VscodeFormHelper>

                {selected &&
                    Object.entries(selected.metadata).map(([key, meta]) =>
                        meta ? (
                            <div key={key}>
                                <VscodeLabel
                                    htmlFor={`${selected.className}-${key}-input`}
                                >
                                    {meta.message}
                                </VscodeLabel>
                                {meta.type === 'input' && (
                                    <VscodeTextfield
                                        key={selected.className + '-' + key}
                                        id={`${selected.className}-${key}-input`}
                                        data-package-field={key}
                                        defaultValue={meta.value}
                                        placeholder={meta.message}
                                        onInput={handleValueChange}
                                    />
                                )}
                            </div>
                        ) : null,
                    )}
            </VscodeFormGroup>
        </div>
    );
};

export default React.memo(PackageContainer);
