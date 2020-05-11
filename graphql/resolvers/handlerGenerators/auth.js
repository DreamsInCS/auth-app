import User from '../../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

require('dotenv').config()

export async function createUser(args) {
    try {
        const {
            email,
            username,
            password
        } = args.userInput

        const existingEmail = await User.findOne({ email: email })
        const existingUsername = await User.findOne({ username: username })

        if (existingEmail || existingUsername) {
            throw new Error('User already exists.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            username,
            password: hashedPassword
        }, (err) => { if (err) throw err })

        user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        return { token, password: null, ...user._doc }
    }
    catch (err) {
        throw err
    }
}

export async function login(args) {
    try {
        const user = await User.findOne({ email: args.email })

        if (!user) {
            throw new Error('Email not recognized.')
        }

        const validPassword = await bcrypt.compareSync(args.password, user.password)

        if (!validPassword) {
            throw new Error('Invalid password.')
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        return { token, password: null, ...user._doc }
    }
    catch (err) {
        throw err
    }
}

export async function verifyToken(args) {
    try {
        const decoded = jwt.verify(args.token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        return { ...user._doc, password: null }
    }
    catch (err) {
        throw err
    }
}