import express from "express";
import { 
  getBooks, 
  addBook, 
  issueBook, 
  returnBook, 
  getMyBooks,
  getActiveIssues
} from "../controllers/library";
import { tenantIsolation } from "../middleware/tenantIsolation";

const router = express.Router();

router.use(tenantIsolation);

router.get("/books", getBooks);
router.post("/books", addBook);
router.post("/issue", issueBook);
router.post("/return", returnBook);
router.get("/my-books", getMyBooks);
router.get("/active-issues", getActiveIssues);

export default router;
