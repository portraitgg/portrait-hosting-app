import { store } from '../../../helpers/store.mjs';

export default async (req, res) => {
  try {
    const authenticated = store.get('accounts.current.portraitId');
    const lastCheckIn = store.get('lastCheckIn.years') as number;
    const lastCheckInMonth = store.get('lastCheckIn.months') as number;
    const lastCheckInDay = store.get('lastCheckIn.days') as number;

    return res.status(200).json({
      portraitId: authenticated,
      nodeAddress: store.get('ethereumAddress'),
      subscribedPortraits: store.get('subscribedPortraits') || [],
      identifier: store.get('accounts.current.identifier'),
      deviceName: store.get('accounts.current.deviceName'),
      lastCheckIn: {
        years: lastCheckIn,
        months: lastCheckInMonth,
        days: lastCheckInDay,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
