import Joi from "joi"

export const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required()
})

export const loginSchema = Joi.object({
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required()
})