import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod/mini";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    //  TODO: use in all other routes (no longer required as NEXT.js automatically does this)
    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: "Only GET method allowed"
    //     }, {status: 405})
    // }

    await dbConnect()
    
    try {

        // first we will exract username from the url
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)  
        // console.log(result) //TODO: remove

        // return all the errors when username is not valid
        if (!result.success) {
            const usernameErrors = result.error.issues.map(issue => issue.message) || []
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? "Username error: " + usernameErrors.join(", ") : "Invalid username parameter"
            }, {status: 400})
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        // check if username already exist
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {status : 400})
        }

        return Response.json({
                success: true,
                message: 'Username is available'
            }, {status : 200})

    } catch (error) {
        console.error("Error checking username" , error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status : 500
            }
        )
    }
}