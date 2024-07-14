export default func => {
    return (req, res, next) => {
        try {
            func(req, res, next)
        }
        catch (err) {
            const {statusCode = 500} = err;
            if (!err.message) err.message = "Oh no, something went wrong!"
            return res.status(statusCode)
        }
    }
}