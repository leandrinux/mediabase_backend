import jwt from 'jsonwebtoken'
import msg from '../log.js'

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
        const token = generateAccessToken({ username: req.body.username});
        res.json({
            "token": token
        });        
    }

}