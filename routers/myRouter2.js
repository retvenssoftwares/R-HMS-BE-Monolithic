// myRouter2.js

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Route 2 Response');
});

export default router;
