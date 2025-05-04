export const getUri = (path: string) => {
    const dataUri = document.querySelector('input[data-uri]');
    if (!dataUri) return;

    const baseUri = dataUri.getAttribute('data-uri');
    return `${baseUri}/${path}`;
};
