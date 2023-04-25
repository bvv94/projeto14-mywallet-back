import {db} from "../database/database.conection.js"

export async function newTransation (req, res) {

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

}

export async function home (req, res) {
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

}