import express from "express";
import {getFavorites, getUserBookings, updateFavorite} from "../controllers/userController.js";
import {requireAuth} from "@clerk/express";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favorite', requireAuth(), updateFavorite);
userRouter.get('/favorites', requireAuth(), getFavorites);

export default userRouter;