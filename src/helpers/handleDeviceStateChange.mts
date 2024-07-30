import { powerMonitor } from 'electron';
import { restartWakuNode } from './protocol/core.mjs';

export function handleDeviceStateChange() {
  powerMonitor.on('resume', () => {
    console.log('Device resumed');
    restartWakuNode();
  });

  powerMonitor.on('suspend', () => {
    console.log('Device suspended');
  });
}

// 'suspend'
// 'resume'
// 'on-ac'
// 'on-battery'
// 'thermal-state-change'
// 'speed-limit-change'
// 'shutdown'
// 'lock-screen'
// 'unlock-screen'
// 'user-did-become-active'
// 'user-did-resign-active'
