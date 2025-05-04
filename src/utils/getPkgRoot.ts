import path from 'path';

export const getPkgRoot = (pkgName: string) => {
    const dirname = __dirname.split('out');
    dirname.pop();
    return path.join(dirname.join('out'), 'node_modules', pkgName);
};
