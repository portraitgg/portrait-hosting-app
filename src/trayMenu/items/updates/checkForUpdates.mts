import { store } from '../../../helpers/store.mjs';
import { getAboutIcon } from '../about/about.mjs';
import { dialog, app, shell } from 'electron';
import { API_URL } from '../../../globals.mjs';

function isNewer(currentVersion, incomingVersion) {
  // Split the version strings into arrays of version segments
  const currentSegments = currentVersion.split('.');
  const incomingSegments = incomingVersion.split('.');

  // Compare each segment of the version numbers
  for (let i = 0; i < Math.max(currentSegments.length, incomingSegments.length); i++) {
    const currentSegment = parseInt(currentSegments[i] || 0); // If segment doesn't exist, default to 0
    const incomingSegment = parseInt(incomingSegments[i] || 0); // If segment doesn't exist, default to 0

    if (incomingSegment > currentSegment) {
      return true; // Incoming version is newer
    } else if (incomingSegment < currentSegment) {
      return false; // Incoming version is older
    }
    // If segments are equal, continue to the next segment
  }

  // If all segments are equal, the versions are identical
  return false;
}

const callForUpdates = async () => {
  const endpoint = `${API_URL}/node/latestversion/get`;

  const get = await fetch(endpoint);

  const data = await get.json();

  const latestVersion = data.version;
  const currentVersion = app.getVersion();

  const isNew = isNewer(currentVersion, latestVersion);

  if (isNew) {
    dialog
      .showMessageBox({
        title: 'Update Available',
        message: `A new version is available`,
        detail: `Would you like to download and install it now?`,
        icon: getAboutIcon(),
        type: 'info',

        buttons: ['Yes', 'No'],
      })
      .then((response) => {
        if (response.response === 0) {
          // Open the download page
          const downloadPage = data.url;
          shell.openExternal(downloadPage);
        }
      });
  } else {
    dialog.showMessageBox({
      title: 'No Updates Available',
      message: `You are running the latest version`,
      detail: `Current version: ${currentVersion}`,
      icon: getAboutIcon(),
      type: 'info',
      buttons: ['OK'],
    });
  }
};

export const getCheckForUpdatesItem = () => {
  const checkForUpdatesItem = {
    label: store.get('menu.checkForUpdates.label'),
    accelerator: store.get('menu.checkForUpdates.accelerator'),
    click: () => {
      callForUpdates();
    },
  };

  return checkForUpdatesItem;
};
