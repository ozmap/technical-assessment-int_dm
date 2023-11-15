import { Router } from "express";
import userController from "../user.controller";
import GeoLib from "../lib";

const router = Router();

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.patch("/user/:id", userController.update);

export default router;
