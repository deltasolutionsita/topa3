/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string, splashShown: boolean) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}${splashShown ? '/?splash=true' : ''}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getStartShellArguments(arg: any) {
  const splitter = process.platform === "win32" ? "\\" : "/";
  const splittedDir = arg[0].dir.split(splitter);
  splittedDir.splice(splittedDir.length - 1, 1);

  const dir: string = splittedDir.join(splitter);
  const projectName = dir.split(splitter)[dir.split(splitter).length - 1];

  return {
    dir,
    projectName,
    commands: arg[0].commands,
  };
}

export function getProjectsFileName() {
  const slash = process.platform === "win32" ? "\\" : "/"
  return slash + "projects.txt"
}
