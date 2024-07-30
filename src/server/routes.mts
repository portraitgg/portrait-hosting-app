import { Router } from 'express';

/// ///////////////////////////////////////////////////////////////////////////////
///                                Begin validators                            ///
/// /////////////////////////////////////////////////////////////////////////////

// /node/ validators
import nodeLoginValidator from './middleware/node/login.mjs';
import nodeGeneratesignatureValidator from './middleware/node/generatesignature.mjs';
import nodeWhoAmIValidator from './middleware/node/whoami.mjs';
import nodeHostValidator from './middleware/node/host.mjs';
import nodeUnhostValidator from './middleware/node/unhost.mjs';
import nodeCheckInValidator from './middleware/node/checkin.mjs';

/// ///////////////////////////////////////////////////////////////////////////////
///                                End validators                              ///
/// /////////////////////////////////////////////////////////////////////////////

/// ///////////////////////////////////////////////////////////////////////////////
///                                Begin controllers                           ///
/// /////////////////////////////////////////////////////////////////////////////

// /node/ controllers
import nodeLoginController from './controllers/node/login.mjs';
import nodeSignOutController from './controllers/node/signout.mjs';
import nodeGeneratesignatureController from './controllers/node/generatesignature.mjs';
import nodeWhoAmIController from './controllers/node/whoami.mjs';
import nodeHostController from './controllers/node/host.mjs';
import nodeUnhostController from './controllers/node/unhost.mjs';
import nodeCheckInController from './controllers/node/checkin.mjs';

/// ///////////////////////////////////////////////////////////////////////////////
///                                End controllers                             ///
/// /////////////////////////////////////////////////////////////////////////////

/// ///////////////////////////////////////////////////////////////////////////////
///                                Begin routes                                ///
/// /////////////////////////////////////////////////////////////////////////////

const router = Router();

// /node/ routes
router.post('/node/login', nodeLoginValidator, nodeLoginController);
router.post('/node/signout', nodeSignOutController);
router.post('/node/generatesignature', nodeGeneratesignatureValidator, nodeGeneratesignatureController);
router.get('/node/whoami', nodeWhoAmIValidator, nodeWhoAmIController);
router.post('/node/host', nodeHostValidator, nodeHostController);
router.post('/node/unhost', nodeUnhostValidator, nodeUnhostController);
router.post('/node/checkin', nodeCheckInValidator, nodeCheckInController);

export default router;
