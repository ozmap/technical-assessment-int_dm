import { Router } from "express";
import userController from "../controller.user";
import { filterUser } from "../middlewares";

const router = Router();

router.post("/", filterUser, userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.patch("/:id", userController.update);
router.delete("/:id", userController.deleteById);

export default router;
