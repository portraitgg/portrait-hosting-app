import { store } from '../../../helpers/store.mjs';

const verifyBody = async (req, res, next) => {
  try {
    const authenticated = store.get('accounts.current.portraitId');

    const identifier = store.get('accounts.current.identifier');

    if (!identifier) {
      return res.status(403).json({ error: 'Not yet logged in, missing identifier' });
    }

    // Check if the user is authenticated
    if (!authenticated) {
      return res.status(403).json({ error: 'Not yet logged in' });
    }
    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export default [verifyBody];
