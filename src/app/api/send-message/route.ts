import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User"

export async function POST(request:Request) {
    await dbConnect()

    const {username , content } = await request.json()

    try {
        const user = await UserModel.findOne({username})

        // check is user exist or not
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status : 404}
            )
        }

        // check if user accept message or not
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, {status: 403})
        }

        // then push message in messages
        const newMessage = { content , createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
                        success: true,
                        message: "Message sent successfully"
                    }, {status: 201})

    } catch (error) {
        console.error("Error adding messages", error)
        return Response.json({
                success: false,
                message: "Internal server Error"
            }, {status: 500})
    }
}
    
