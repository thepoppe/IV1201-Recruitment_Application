require('dotenv').config();
const jwt = require('jsonwebtoken');
/**
 * Authorization Handler class for handling Authentication and Authorization
 */
class AuthHandler{
    /**
     * Constructor for the AuthHandler
     * Sets the secret and expiration time for the token
     */
    constructor(){
        this.secret = process.env.JWT_SECRET;
        this.expiresIn = process.env.JWT_EXPIRES_IN;
    }

    /**
     * Generates a token with the payload
     * @param {Object} payload - The payload for the token
     * @returns {string} - The generated token
     */
    generateToken(payload){
        return jwt.sign(payload, this.secret, {expiresIn: this.expiresIn});
    }

    /**
     * Verifies the token
     * @param {string} token - The token to be verified
     * @returns {Object} - The decoded token
     * @throws {Error} - If the token is invalid, malformed or expired
     */
    verifyToken(token){
        return jwt.verify(token, this.secret);
    }

    /**
     * Middleware function that authenticates the user
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next function
     * @returns {Function} - The next function
     * @throws {Error} - If the token is not provided, expired or invalid
     */
    async authenticateUser(req, res, next){
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({error: 'Token not provided'});
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Token not provided',  });
        }
        try {
            req.decoded = this.verifyToken(token);
            return next();
        } 
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: error.message });
        }
    }

    /**
     * Middleware function that authorizes the user for person requests
     * @param {Object} controller - The controller object
     * @returns {Function} - The middleware function
     * @throws {Error} - If the user is not authorized
     * @throws {Error} - If there is an error in the authorization process
     */
    authorizePersonRequest(controller) {
        return async (req, res, next) => {
            if (String(req.params.id) !== String(req.decoded.id)) {
                try {
                    const role = await controller.getUserRole(req.decoded.id);
                    if (role !== 'recruiter') {
                    return res.status(401).json({ error: 'Unauthorized' });
                    }
                } 
                catch (error) {
                    return res.status(500).json({ error: 'Authorization error' });
                }
            }
            return next();
        };
    }

    /**
     * Helper function to extract the user data from the person object
     * @param {Object} person - The person object
     * @returns {Object} - The extracted user data
     */
    extractUserData(person) {
        return {
            id: person.id,
            email: person.email
        };
    }
    
    /**
     * Adds the token to the response when login is successful
     * @param {Object} person - The person object
     * @returns {Object} - The token and person object
     */
    addTokenToResponse(person){
        const token = this.generateToken(this.extractUserData(person));
        return {token: token, person:person};
    }
}
module.exports = AuthHandler;