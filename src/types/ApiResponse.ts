import { Message } from "@/model/User";

export interface ApiRespone{
    success: boolean
    message: string
    isAcceptingMessage?: boolean
    messages?: Array<Message>
}