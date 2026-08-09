import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import {
  createChallanController,
  getChallansController,
  getChallanByIdController,
  updateChallanController,
  confirmChallanController,
  cancelChallanController,

} from "../controllers/challan.controller";

const router = Router();

router.get(
  "/:id",
  authenticate,
  getChallanByIdController
);

router.post(
  "/",
  authenticate,
  createChallanController
);
router.get(
  "/",
  authenticate,
  getChallansController
);

router.put(
  "/:id",
  authenticate,
  updateChallanController
);

router.patch(
  "/:id/confirm",
  authenticate,
  confirmChallanController
);

router.patch(
  "/:id/cancel",
  authenticate,
  cancelChallanController
);




export default router;