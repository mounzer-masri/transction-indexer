import express  from "express";
import controller from "../controllers/AccountsReaderController"

const router = express.Router();
router.post('/tx-history', controller.getTransactionHistoryApi);

export default {} = router;
 