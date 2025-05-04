// src/pages/Home.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    VscodeBadge,
    VscodeButton,
    VscodeIcon,
    VscodeLabel,
    VscodeTabHeader,
    VscodeTabPanel,
    VscodeTabs,
} from '@vscode-elements/react-elements';

import {
    PackageMetadata,
    availableBackendPackages,
    availableFrontendPackages,
    boilerplateDefaults,
} from '@ragarwal06/sap-cloud-application-generator-types';

import PackageContainer from '../components/PackageContainer';
import GlobalFlags from '../components/MetadataGroup';

import './Home.css';
import { vscode } from '../utils/vscode';

const mainImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAACEVJREFUeJztWV1sG8cRTp/6lr40QOof8ai3Nk8p4iBuXcMpUPShaPPS+ikFChRtgdZtRIpuk8KFKcVpnaI26uMJCeK4ko48SmYqWRR/rNiuRFnyUfkpVFh3lAEFKWDFRiyKbUXKTtpIvMzM7sUn8Y6kHIpMk/uAxbd7u3vcmZudmV3ed58LFy5cuHDhwoWLraN78Paeo9HivmBk5bFjyp1HkX8Xub0HuZsz9h+L3WFjBm4/srHvzj6n+cdjxhdaLV9NBKNFDcoKFCOorLyJDAJNUDu68gZrr/wnqBQX2LPiZXqmFCc5LzjN71JWv91q+WoiqJQGu6KlMVjwiaPK6okupZgJRoovYhueR6mtlI50DZS6sd4dLZ2jZyYrxTTOZ/XVUd43jPyc8t7jrZavJsgClJUVrHdFV7/Fv2SQ9a2cxzaa8rODpS9/Si2gmIDFzgDHgM8Aq8Hoah+1B4pD1B4opoMDpWHWV4ojd3MORkoTfL4KJcXHnEN+Nlr6Zqvlq4nPvA8wEYzc2QWL/iLysZix09q2jnk+buxAPsnHVJvfGklcbA3r4fbF9bD3BrCxJgsqcVjIIMPzq4zbjbLM6jAmYx0LY26uhwXb+Ua/Z6/T7wZCeiwg6UanqN3slLQbWA9ImkrPQpqvaQpY6xf+ttbvmQYhZo1wWxK5HG4bZW3hAjLVld0XeF+ctT0p5LU+z3RZ9kzZzo/sfKyKAoIg8ERnSI9jobqk9xL3aN9vmgLsLKAc9k7S1+0XtHuxAHO+EREcFfCJwVrYG4eFjwFn1uS2EWQw3WHk9d7dz4EgQVY8AWSjt62D2rLg4/zMekR4mtXbnrfON/p3PNxq+Wqimg/Y6hcEoQ9+nPktAQgNPsALPsALe1dIIRuy5wjs/wPrsuclEGoCixHxRJGh/zTnPurrF8CCvDF8F/iJJ+g9/Z4EvSfy4B7zd3yS/hDb87mf11rTuuz9BfsNIVrx+5H2mvO3BDsLWJfbyQvDD2br8gFy+3U+3tECAtL8Xubp9RO11yScdIpC8Kzm/KqAr+DHhfhD+g9qKkD2kiBYx5BmtwCavxUFhLSM9febhl+KC/cHQvMHfGLuCCxg1nfq2hO0aJswaChtPyXhZEHh4fCAoez8IYVE2fMnakd37EMuy8I4vgPHsy1gDYM2W0DMnUb2i9qPcD2wrs83RQFOX6D2FhDKjdgCFevhidCvxYXtT5lT2Xzwr5m8D5MP0HwHMmRgX+GLrgyDiufHpJyI0FeW28erhUGYm4KtMoLjjYHd36P5smeIeOBLj5hr6HhhXmDJT45+33dK66OPgWvZ7swPFGBAydj11bYAb7nau+v2AWDu3AlO8nRXtaTC1xso7l2ksks9yWx+Iqkuzaaz+TTWQRGnkRPZ/AEcg87N6Nu9n/Z1eNchCl+KwHxAWDhL6S6FJIcwKAuXMZTSu2IPPkDv6Wf+4Tehv78Ewk3gnvdJ2ivAs/5TWgIZ0t80saRP+UO5yzgm0KMfbbQCsiBwGS0AlHDVtATervDC5he08wFmSKrmAzYDhMz6Jb1MPkfSrlp90CYL4Ich/WyDBM+fZMIum0Jb66YCVGqrSzfBIm7wvg0LgL2t1soD4MDzkRMDAQ6SsOIcE9IUmuq5OhTQoNPgZ14BFkXMbEUBd5/lJ5H/90FZMwDVMjEQaLFSAO7oJF2rpYBtDYOmw8NyfmY5llTzs8nschw5PVNIsfbSdDpbmKL6TCGJnFKXR5HfufX+pXf/9d9Zay7+du93fose/Vd/1vYh+0V9HJKbKUyuOsX5JLGkjSJD3yVkqku5C3xMnDg0P4CODxKhB7ZNAVacf62wt24LuDtmDtn6HjOVrmbCH22BkD7nZAFNT4Xhi+/ChCipFjoYL/WRoOrSq1AfY/X8CHIyWxhivHQMx25UAGSUmMiEWCLjD2mvgsBjWPeJ+ggyKGeItXNJluxAESHzs0nEWgYQOsb3u6MFgNJqprL1WgD2NVO+Cmw+j4+9XngIk6HU6//ejwXrideWD2HSlLqydATboID7SViap/VUvA98ADi6cTDvKUxqIM1NUbITmksw1p+kDBDKYSn3VZyHpk9JDzxzWuu23AfUcx6HxOkgtwDfxrls79q+1yYKmBbgF3MVFrT5OG6HbbkPMJ3gybNv28XhmpmcacL1CLABhvG5T4QTvAj7GUPby6nro8cjC7N/jP4zhfyHyFvTv5ffGkeT7Ahd+zqZNQ9xsF2GOnkY6xTnKEnyi/M/o/sEcf4Q2wK5/Vjs5oNT/AY/BFnCoD5qvY9oGmi/o3nPsCTHGgZfmXzX0Yl1mhbAt8BWw6A5H+r/sJ4Gm24BfAtkIOkZ5iHvnBkG41O3xnrTi5mXk4sjyH9JLg4hn0kuJvvOvzNOoU3KnSEFiPM/YeFPP1dPGDzco4/zcQnOw6xP++7mNTLHivcDuacoZJ7SA8gNUQDE/6/dSyIEfWWe118hBWzRApxOg3YW4HSWaIgCxt5YfpRCnJofJZ7Jp5FBwCkqrJ5iYTCfIM7mLyaA2fldG8T3MB+w8TzvFAZhzMVOeg7PJP0CPSMfoM36pEofgGmxnQ9piAL+HyygKQDB/PUqwDxB2oXBuhRgdxyu438BVwHNBAi46HQfAHmDdi8K2Hwf0GoZqwIPRckr+TjdG8wUotb7gLS6fAmZnfH1DYmQP3QtxVibNu8DAqHcMPufXzvNzw+DyK2WsW5YzgIb7gPqt4AGXWq2CnhCxPN/Qi08hZxSbx1GpuRG1HtxjJkIdYjacfZHh/4MKONpSlxa5dm3Gx/rMPRpgPU8j5eY/E/N5tzluXDhwoULFy5cuHDGh9c81Q45IgJ5AAAAAElFTkSuQmCC'

export default function Home() {
    const [data, setData] = useState({ ...boilerplateDefaults });
    const [frontendPackage, setFrontendPackage] =
        useState<PackageMetadata | null>(availableFrontendPackages.ui5);
    const [backendPackage, setBackendPackage] =
        useState<PackageMetadata | null>(availableBackendPackages.springboot);

    useEffect(() => {
        const pkgs: Record<string, PackageMetadata> = {};
        if (frontendPackage) {
            pkgs[frontendPackage.packageName] = frontendPackage;
        }
        if (backendPackage) {
            pkgs[backendPackage.packageName] = backendPackage;
        }
        setData((prev) => ({ ...prev, packages: pkgs }));
    }, [frontendPackage, backendPackage]);

    // Badge counts
    const frontendCount = useMemo(
        () => (frontendPackage ? 1 : 0),
        [frontendPackage],
    );
    const backendCount = useMemo(
        () => (backendPackage ? 1 : 0),
        [backendPackage],
    );

    const handleHelp = useCallback(() => {
        openExternal(
            'https://therahulagarwal.com/sap-cloud-application-generator');
    }, []);

    // const handleReset = useCallback(() => {
    //     setData({ ...boilerplateDefaults });
    //     setFrontendPackage(availableFrontendPackages.ui5);
    //     setBackendPackage(availableBackendPackages.springboot);
    // }, []);

    const generate = () => {
        vscode.postMessage({
            command: 'generate',
            data,
        });
    };

    const openExternal = (url: string) => {
        vscode.postMessage({
            command: 'openExternal',
            data: url,
        });
    }

    return (
        <div className='home-container'>
            <div className='home-main'>
                <div className='header'>
                    <img
                        className='avatar'
                        src={mainImage}
                        alt='Generator logo'
                    />
                    <div className='main-title'>
                        <span className='header-title'>
                            SAP Cloud Application Generator
                        </span>
                        <br />
                        <VscodeBadge variant='counter'>1.1.2</VscodeBadge>
                    </div>
                    <div className='header-actions'>
                        <VscodeIcon
                            name='question'
                            action-icon
                            label='Help'
                            onClick={handleHelp}
                        />
                    </div>
                </div>

                <div className='details'>
                    <VscodeLabel htmlFor='main-header-desc'>About</VscodeLabel>
                    <p id='main-header-desc'>
                        The SAP Cloud Application Generator is a powerful tool
                        powerful tool enables you to quickly scaffold
                        applications, allowing you to build functional apps in a
                        matter of minutes. With our intuitive interface, you
                        have convenient access to a range of frontend and
                        backend packages, making the app scaffolding process
                        effortless and efficient.
                    </p>
                </div>

                <div className='global-flags-container'>
                    <GlobalFlags data={data} setData={setData} />
                </div>

                <VscodeTabs>
                    <VscodeTabHeader slot='header'>
                        Frontend{' '}
                        <VscodeBadge variant='counter'>
                            {frontendCount}
                        </VscodeBadge>
                    </VscodeTabHeader>
                    <VscodeTabPanel>
                        <PackageContainer
                            availablePackages={availableFrontendPackages}
                            selected={frontendPackage}
                            setSelectedPackage={setFrontendPackage}
                        />
                    </VscodeTabPanel>

                    <VscodeTabHeader slot='header'>
                        Backend{' '}
                        <VscodeBadge variant='counter'>
                            {backendCount}
                        </VscodeBadge>
                    </VscodeTabHeader>
                    <VscodeTabPanel>
                        <PackageContainer
                            availablePackages={availableBackendPackages}
                            selected={backendPackage}
                            setSelectedPackage={setBackendPackage}
                        />
                    </VscodeTabPanel>
                </VscodeTabs>

                <div className='footer-input'>
                    <br />
                    <div className='footer-buttons'>
                        <VscodeButton disabled={false} onClick={generate}>
                            Generate
                        </VscodeButton>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className='home-sidebar'>
                <div className='sidebar-section'>
                    <div className='sidebar-title'>Try Our Other Apps</div>
                    <div className='sidebar-body'>
                        {[
                            {
                                key: 'resume-gen',
                                title: 'Resume Generator',
                                logo: '',
                                description:
                                    'Generate ATS-friendly resumes via LaTeX with smart design ratios.',
                                href: 'https://therahulagarwal.com/rahul-resume/',
                            },
                            {
                                key: 'beeaway',
                                title: 'BeeAway',
                                logo: 'data:image/png;base64,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',
                                description:
                                    'Keep your Mac alive and reachable even when you step away.',
                                href: 'https://therahulagarwal.com/bee-away/',
                            },
                        ].map((app) => (
                            <div key={app.key} className='app-card'>
                                {app.logo !== '' ? (
                                    <img
                                        src={app.logo}
                                        alt={`${app.title} logo`}
                                        className='app-logo'
                                    />
                                ) : (
                                    <img
                                        src={mainImage}
                                        alt={`${app.title} logo`}
                                        className='app-logo'
                                    />
                                )}
                                <div className='app-info'>
                                    <div className='app-title'>{app.title}</div>
                                    <div className='app-desc'>
                                        {app.description}
                                    </div>
                                    <VscodeButton
                                        onClick={() => {
                                            openExternal(app.href);
                                        }}
                                    >
                                        Learn More
                                    </VscodeButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='sidebar-section'>
                    <div className='sidebar-title'>About the Author</div>
                    <div className='app-card'>
                        <img
                            src='https://github.com/ragarwalll.png'
                            alt='Rahul Agarwal'
                            className='author-photo app-logo'
                        />
                        <div className='app-info'>
                            <div className='app-title'>Rahul Agarwal</div>
                            <div className='app-desc'>
                                Creator of this extension. Follow me on GitHub
                                for more projects.
                            </div>
                            <VscodeButton
                                onClick={() => {
                                    openExternal('https://therahulagarwal.com/');}}
                            >
                                Read More
                            </VscodeButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
