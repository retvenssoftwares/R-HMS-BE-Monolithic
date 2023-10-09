// myRouter1.js

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Route 1 Response');
});

export default router;
