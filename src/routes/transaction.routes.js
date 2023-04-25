import { Router } from "express"
import { newTransation, home } from "../controllers/transaction.controller.js"
import { transactionSchema } from "../schemas/transaction.schema.js"

const transactionRouter = Router()

transactionRouter.post("/nova-transacao/:tipo", validadeSchema(transactionSchema), newTransation)
transactionRouter.get("/home", home)