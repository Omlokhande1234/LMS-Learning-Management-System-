import { Router } from "express";
import { isLoggedin, authorizeRoles } from "../Middlewares/authMiddlewares.js";
import { getUserStats } from "../Controllers/adminController.js";

const router = Router();

// GET /admin/stats/users
router.get(
  "/stats/users",
  isLoggedin,
  authorizeRoles("ADMIN"),
  getUserStats
);

export default router;
