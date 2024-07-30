import { store } from '../../../helpers/store.mjs';

const verifyBody = async (req, res, next) => {
  try {
    const { portraitId, authenticatedPortraitId, identifier } = req.body;
    const authenticated = store.get('accounts.current.portraitId');

    const identifierInStore = store.get('accounts.current.identifier');

    if (!identifier) {
      return res.status(403).json({ error: 'Not yet logged in, missing identifier' });
    }

    if (identifier !== identifierInStore) {
      return res.status(403).json({ error: 'Not authenticated' });
    }

    // Portrait ID must be an unsigned integer
    if (!portraitId || typeof portraitId !== 'number' || portraitId < 0) {
      return res.status(400).json({ error: 'Bad Request: portraitId' });
    }

    // authenticatedPortraitId must be an unsigned integer
    if (!authenticatedPortraitId || typeof authenticatedPortraitId !== 'number' || authenticatedPortraitId < 0) {
      return res.status(400).json({ error: 'Bad Request: authenticatedPortraitId' });
    }

    // Check if the user is authenticated
    if (!authenticated) {
      return res.status(403).json({ error: 'Not yet logged in' });
    }

    // Check if the portraitId equals the authenticated portraitId
    if (authenticated !== authenticatedPortraitId) {
      return res.status(403).json({ error: 'Not authenticated' });
    }

    // Check if the portrait is already hosted
    const subscribedPortraits = store.get('subscribedPortraits') as number[];

    // subscribedPortraits is an array of portraitIds, check if the portraitId is not in the array
    if (!subscribedPortraits.includes(portraitId)) {
      return res.status(400).json({ error: 'Portrait not hosted' });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export default [verifyBody];
