import jwt from 'jsonwebtoken'
import msg from '../log.js'
import data from '../data/index.js'

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

export default {

    createUser: async (req, res) => {

        console.log(req.body)
        if (!req.body || !req.body.username) {
            res.status(400).json({message: "bad request"})
            return
        }

        const username = req.body.username
        const user = await data.user.getUser(username)
        
        if (user) {
            res.status(400).json({message: "user already exists"})
            return
        }

        const token = generateAccessToken({ username: username });
        await data.user.addUser(username)

        res.json({ "token": token })
    }

}