import { Router } from "express";
import userController from "../user.controller";

const router = Router();

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.patch("/:id", userController.update);
router.delete("/:id", userController.deleteById);

export default router;
