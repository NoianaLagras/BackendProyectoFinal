export const authMiddleware = () => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== 'Admin') {
            return res.status(403).json("Not authorized");
        }
        next();
    };
};
