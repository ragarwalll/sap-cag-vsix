import * as path from 'path';

export const getPkgRoot = (pkgName: string) => {
  const parts = __dirname.split(path.sep + 'out');
  return path.join(parts[0], 'node_modules', pkgName);
};