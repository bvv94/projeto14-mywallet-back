import cors from "cors"
import express from "express"
import { signUp } from "./controllers/user.controller.js"
import { signIn } from "./controllers/user.controller.js"
import { newTransation } from "./controllers/transaction.controller.js"
import { home } from "./controllers/transaction.controller.js"
// Criação do servidor
const app = express()
const PORT = 5000

// Configurações
app.use(express.json())
app.use(cors())


//Endpoints

app.post("/cadastro", signUp)
app.post("/", signIn)
app.post("/nova-transacao/:tipo", newTransation)
app.get("/home", home)


// Deixa o app escutando, à espera de requisições
app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`))