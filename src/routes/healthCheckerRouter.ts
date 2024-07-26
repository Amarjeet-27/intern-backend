import { Router } from 'express';
import { healthcheck } from "../controllers/healthCheckerController"

const router = Router();

router.route('/health').get(healthcheck);

export default router