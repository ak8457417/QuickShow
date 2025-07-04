import Show from "../models/Shows.js";
import Booking from "../models/Booking.js";
import {getAuth} from "@clerk/express";
import stripe from "stripe";

const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])

        return !isAnySeatTaken;
    } catch (error) {
        console.error(error.message);
        return false
    }
}

export const createBooking = async (req, res) => {
    try {
        const {userId} = req.body;
        // const { userId } = getAuth(req)

        const {showId, selectedSeats} = req.body;
        const { origin } = req.headers;

        console.log("user:::::" , userId);

        // check if the seat is available for the selected show
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if(!isAvailable) {
            return res.json({success: false, message: "selected seats are not available."});
        }

        // get the show details
        const showData = await Show.findById(showId).populate('movie')

        // create new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save()

        // stripe payment
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // creating line items for stripe
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now()/ 1000 ) + 30 * 60,
        })

        booking.paymentLink = session.url
        booking.isPaid = true
        await booking.save()

        res.json({success: true, message: "booking successfully created!", url: session.url})

    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success: true, occupiedSeats})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}