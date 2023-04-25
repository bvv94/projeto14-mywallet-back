import { Router } from "express"
import { signIn, signUp } from "../controllers/user.controller.js"
import { userSchema, loginSchema } from "../schemas/user.schema.js"

const userRouter = Router()

userRouter.post("/cadastro", validadeSchema(userSchema), signUp)
userRouter.post("/", validadeSchema(loginSchema), signIn)

export default userRouter