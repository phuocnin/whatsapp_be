import { sign } from "jsonwebtoken"
import authService from "../services/auth.service.js"
import { generateToken } from "../services/token.service.js"


const register = async (req, res, next) => {
    try {
        const newUser = await authService.createUser(req.body)
        const access_token = await generateToken({ userId: newUser._id }, "1d", process.env.ACCESS_SECRETKEY_TOKEN)
        const refresh_token = await generateToken({ userId: newUser._id }, "1d", process.env.REFRESH_SECRETKEY_TOKEN)
        res.cookie('refreshToken', refresh_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
        })
        res.json({
            message: "register success.",
            access_token, newUser
        });

    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const user = await authService.signUser(req.body);
        const access_token = await generateToken({ userId: user._id }, "1d", process.env.ACCESS_SECRETKEY_TOKEN)
        const refresh_token = await generateToken({ userId: user._id }, "1d", process.env.REFRESH_SECRETKEY_TOKEN)
        res.cookie('refreshToken', refresh_token, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
        })
        res.json({
            message: "login success.",
            access_token, user
        });
    } catch (err) {
        next(err)
    }

}

const logout = async (req, res, next) => {
    res.clearCookie('refreshToken', { path: "/api/v1/auth/refreshtoken" });
    res.json({ message: "logout success." })
}
module.exports = {
    register,
    login,
    logout
}