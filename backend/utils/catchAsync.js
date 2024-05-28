export default func => {
    return (req, res, next) => {
        try {
            func(req, res, next)
        }
        catch (e) {
            return e
        }
    }
}