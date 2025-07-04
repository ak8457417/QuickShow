import Booking from "../models/Booking.js";
import {clerkClient, getAuth} from "@clerk/express";
import Movie from "../models/Movies.js";

// api controller function get user bookings
export const getUserBookings = async (req, res) => {
    try {

        // const user = req.auth().userId;
        // const { userId } = getAuth(req)
        const {userId} = req.query;

        console.log("userId received:", userId);

        const bookings = await Booking.find({ user: userId }).populate({
            path:'show',
            populate: {path: 'movie'}
        }).sort({createdAt: -1})

        res.json({success: true, bookings});
    } catch (error) {
        console.error(error);
        res.json({success: false, error: error.message});
    }
}

// api controller function to update favourite movie in clerk user metadata
export const updateFavorite = async (req, res) => {
    try {
        const { movieId } = req.body;
        // const userId = req.auth.userId;
        const { userId } = getAuth(req)

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
                item => item !== movieId
            )
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata});

        res.json({success: true, message: "Favorite was successfully updated!"});
    } catch (error) {
        console.error(error);
        res.json({success: false, error: error.message});
    }
}

export const getFavorites = async (req, res) => {
    // try {
    //     const {userId} = req.auth;
    //
    //     const user = await clerkClient.users.getUser(userId);
    //     const favorites = user.privateMetadata.favorites
    //
    //     const movies = await Movie.find({_id: {$in: favorites}})
    //
    //     res.json({success: true, movies});
    // } catch (error) {
    //     console.error(error);
    //     res.json({success: false, error: error.message});
    // }
    try {
        const { userId } = req.auth(); // ✅ NEW way

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // ✅ Fetch Clerk user details
        const user = await clerkClient.users.getUser(userId);

        const favorites = user.privateMetadata?.favorites || [];

        const movies = await Movie.find({ _id: { $in: favorites } });

        res.json({ success: true, movies });

    } catch (error) {
        console.error("GetFavorites Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}