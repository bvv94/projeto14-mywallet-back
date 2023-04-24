import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import joi from "joi"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

// Criação do servidor
const app = express()
const PORT = 5000

// Configurações
app.use(express.json())
app.use(cors())
dotenv.config()

// Conexão DB

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))
    
// let db
// console.log(process.env.DATABASE_URL)
// const mongoClient = new MongoClient(process.env.DATABASE_URL)

// try {
//     await mongoClient.connect()
//     console.log('MongoDB conectado!')
// } catch (err) {
//     console.log(`MongoDB NÃO conectado, erro :${err.message}`)
// }

// db = mongoClient.db()

//Schemas
const userSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().min(3).required().email(),
    password: joi.string().min(3).required()
})

const transactionSchema = joi.object({
    price: joi.number().precision(2).required(),
    description: joi.string().required(),
    type: joi.string().valid("in", "out").required()
})

//Endpoints

app.post("/cadastro", async (req, res) => {
    const { name, email, password } = req.body

    const validation = userSchema.validate(req.body)

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const user = await db.collection("users").findOne({ email })
        if (user) return res.status(409).send("E-mail já cadastrado")

        //encriptografa senha
        const hash = bcrypt.hashSync(password, 10)

        await db.collection("users").insertOne({ name, email, password: hash })
        res.status(201)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/", async (req, res) => {
    const { email, password } = req.body

    //validação com joi se email e senha são válidos
    const validation = userSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }
    // FIM validação com joi se email e senha são válidos

    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.status(404).send("E-mail não cadastrado.")

        const rightpassword = bcrypt.compareSync(password, user.password)
        if (!rightpassword) return res.status(401).send("Senha inválida!")



        const token = uuid()
        await db.collection("session").insertOne({ token, userId: user._id })

        res.send(token)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/nova-transacao/:tipo", async (req, res) => {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    const { price, description, type } = req.body

    if (!token) return res.sendStatus(401)

    const validation = transactionSchema.validate(req.body)

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const session = await db.collection("session").findOne({ token })
        if (!session) return res.sendStatus(401)

        await db.collection("transactions").insertOne({ ...req.body, userId: session._id })

    }
    catch (err) {
        res.status(500).send(err.message)
    }

})

app.get("/home", async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.sendStatus(401)

    try {
        const session = await db.collection("session").findOne({ token })
        if (!session) return res.sendStatus(401)

        const transactions = await db.collection("transactions").find({ userId: session.userId }).toArray()
        res.send(transactions)
    }
    catch (err) {
        res.status(500).send(err.message)
    }

})






// Deixa o app escutando, à espera de requisições
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))