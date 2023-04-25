import {db} from "../database/database.conection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signUp(req, res) {
    const { name, email, password } = req.body

    const validation = userSchema.validate(req.body)

    console.log("entrou na rota /cadastro")

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const user = await db.collection("users").findOne({ email })
        if (user) return res.status(409).send("E-mail já cadastrado")

        //encriptografa senha
        const hash = bcrypt.hashSync(password, 10)

        await db.collection("users").insertOne({ name, email, password: hash })
        res.status(201).send("Usuário cadastrado")
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    //validação com joi se email e senha são válidos
    const validation = loginSchema.validate(req.body, { abortEarly: false })

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
}
