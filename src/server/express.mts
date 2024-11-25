import express from 'express';
import cors from 'cors';
import routes from './routes.mjs';
import { EXPRESS_PORT, FRONTEND_URL } from '../globals.mjs';
const app = express();

// This has to be defined before the routes, otherwise it won't work
// https://stackoverflow.com/questions/72038365/how-to-allow-access-control-allow-private-network-with-an-nodejs-express-webse
app.use(function setCommonHeaders(req, res, next) {
  const origin = req.headers.origin;

  if (origin === FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Private-Network');
    res.set('Access-Control-Allow-Private-Network', 'true');
    next();
  } else {
    return res.status(403).send('Forbidden');
  }
});

function startExpressServer() {
  app.listen(EXPRESS_PORT, () => {
    console.log(`Express server is running on port ${EXPRESS_PORT}`);
  });

  app.use(express.json());
  app.use(cors());
  app.use(routes);
}

export { startExpressServer };
