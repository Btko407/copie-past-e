/**
 * Canonical extension download URL helpers.
 * All components that reference the extension ZIP must import from here.
 * Never hardcode '/copie-past-e.zip' or any version string elsewhere.
 */

export const DEFAULT_EXTENSION_VERSION = "1.3.1";

export function getLocalExtensionDownloadUrl(
  version = DEFAULT_EXTENSION_VERSION,
): string {
  return `/copie-paste-extension-v${version}.zip`;
}

/** Ready-to-use href for the current canonical extension package. */
export const EXTENSION_DOWNLOAD_URL = getLocalExtensionDownloadUrl();

/** File name shown in the browser download dialog. */
export function getExtensionDownloadFilename(
  version = DEFAULT_EXTENSION_VERSION,
): string {
  return `copie-paste-extension-v${version}.zip`;
}
