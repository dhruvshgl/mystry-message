import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
 
export async function POST(request: Request) {
    await dbConnect()

    try {

        const {username , code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        // Check if user exist or not
        if (!user) {
            return Response.json(
            {
                success: false,
                message: "User not found"
            }, { status : 404}
        )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date() 

        // Check if user has valid code and its code not expired then verify the user and save
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()                                 

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }, {status : 200}
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
            {
                success: false,
                message: "Verification code has expired please sign-up again to get a new code"
            }, { status : 400}
            )
        } else {
            return Response.json(
            {
                success: false,
                message: "Incorrect Verification Code"
            }, { status : 400}
            )
        }

    } catch (error) {
        console.error("Error vrifying user" , error)
        return Response.json(
            {
                success: false,
                message: "Error verifing user"
            }, { status : 500}
        )
    }
}