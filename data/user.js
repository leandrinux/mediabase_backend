import models from './models.js'

export default {

    getUser: async (username) => {
        const user = await models.User.findOne({
            where: { id: username }
        })
        return user
    },

    addUser: async (username) => {
        return await models.User.create({
            id: username
        })
    }

}