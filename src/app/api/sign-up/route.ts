import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    
    await dbConnect()

    try {
        const {username , email , password } = await request.json()

        // Check if a user with the provided username already exists in the database
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success:false,
                message: "Username already exist"
            }, {status: 400})
        }

        // Check if a user with the provided email address already exissts in the database
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {

            // if user exists check if the user is verified or not 
            if (existingUserByEmail.isVerified) {
                return Response.json({
                success:false,
                message: "User already exist with this email"
            }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000 )
                await existingUserByEmail.save()
            }

            // Create a new user if none of the above conditions satisfy
        } else {
            const hashedPassword = await bcrypt.hash(password, 10) 
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save()
        }

        //After creating user , send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        // return a error message if failed to send verification email
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 400})
        }

        // verification email sent , now user just need to verify it 
        return Response.json({
                success: true,
                message: "User registered successfully . Please verify your email"
            }, {status: 201})

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}