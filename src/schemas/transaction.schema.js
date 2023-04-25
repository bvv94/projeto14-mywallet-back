import joi from "joi"

export const transactionSchema = joi.object({
    price: joi.number().precision(2).required(),
    description: joi.string().required(),
    type: joi.string().valid("in", "out").required()
})