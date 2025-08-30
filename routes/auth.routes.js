import express from "express";


const router = express.Router();


import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { deleteUser, listUsers, login, logout, me, refresh, register, updateUser } from "../controller/auth.controller.js";


router.post("/register",  register);
router.post("/login", login)
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me",requireAuth, me);


// Admin action on users

router.get("/users", requireAuth, requireRole("admin"), listUsers);
router.put("/user/:id", requireAuth, requireRole("admin"), updateUser);
router.delete("/user/:id", requireAuth, requireRole("admin"), deleteUser);


// update user

router.put("/user/:id", requireAuth, updateUser)

// Admin Routes to manage user

router.get("/users", requireAuth, requireRole("admin"), listUsers);




export default router;
