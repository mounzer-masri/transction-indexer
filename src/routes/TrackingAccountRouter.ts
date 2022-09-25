import express  from "express";
import controller from "../controllers/TrackingAccountController"

const router = express.Router();
router.post('/add-account', controller.startTrackingAccountApi);

export default {} = router;
 