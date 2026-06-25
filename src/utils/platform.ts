import os from "node:os";

export const platform = os.platform(); // 'win32' | 'linux' | 'darwin'
export const isWindows = platform === "win32";
export const isMac = platform === "darwin";
export const isLinux = platform === "linux";
