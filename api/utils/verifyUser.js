import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;
//     console.log(toekn);
//     if (!token) return next(errorHandler(401, 'You are not authenticated!'));

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return next(errorHandler(403, 'Token is not valid!'));
//         req.user = user;
//         next();
//     });
// }

// import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';
import User from '../models/user.model.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'You are not authenticated!'));

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(errorHandler(403, 'Token is not valid!'));

        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return next(errorHandler(404, 'User not found'));
            }
            req.user = user;
            next();
        } catch (error) {
            return next(errorHandler(500, 'Internal Server Error'));
        }
    });
};


export const verifySuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'superadmin') {
            return next(errorHandler(403, 'Access denied!'));
        }
        next();
    } catch (error) {
        console.error('Error verifying superadmin:', error);
        res.status(500).json({ message: 'Error verifying superadmin', error: error.message });
    }
};