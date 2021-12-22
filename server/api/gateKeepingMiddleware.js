const { models: { User } } = require('../db'); 
/*
    Store all of our functions that will act as
    middleware between our request and our response
*/

const requireToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = await User.findByToken(token);
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = {
    requireToken
}