import {clerkClient, getAuth} from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    // try {
    //     // const userId = req.auth.userId;
    //     const { userId } = getAuth(req)
    //     console.log(userId);
    //     const user = await clerkClient.users.getUser(userId);
    //     console.log("user", user);
    //
    //     if (user.privateMetadata?.role !== 'admin') {
    //         return res.json({success: false, error: "not authorized"});
    //     }
    //
    //     next();
    //
    // } catch (error) {
    //     return res.json({success: false, error: "Not Authorized"});
    // }
}
