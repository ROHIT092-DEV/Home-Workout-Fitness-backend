import express from "express";


const router = express.Router();


import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { listUsers, login, logout, me, refresh, register, updateUser } from "../controller/auth.controller.js";


router.post("/register",  register);
router.post("/login", login)
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me",requireAuth, me);


// update user

router.put("/user/:id", requireAuth, updateUser)

// Admin Routes to manage user

router.get("/users", requireAuth, requireRole("admin"), listUsers);




export default router;