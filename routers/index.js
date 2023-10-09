// routers/index.js

import { Router } from 'express';
import myRouter1 from './myRouter1'; // Import your router files
import myRouter2 from './myRouter2';

const router = Router();

router.use('/api/route1', myRouter1);
router.use('/api/route2', myRouter2);

export default router;
