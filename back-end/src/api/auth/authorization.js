require('dotenv').config();
const jwt = require('jsonwebtoken');
const GenericAppError = require("../../utils/genericAppError")
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
     * @throws {TokenExpiredError} If the token is expired
     * @throws {Error} - If the token is invalid, malformed
     */
    verifyToken(token){
        return jwt.verify(token, this.secret);
    }

    /**
     * Middleware function that verifies the JWT, 
     * and attaches the decoded token to the request object.
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next function
     * @returns {void} Calls next() if authentication is successful
     * @throws {GenericAppError} - If the token is not provided, expired or invalid
     */
    async authenticateUser(req, res, next){
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(GenericAppError.createAuthenticationError("Token not provided in Authorization header"));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(GenericAppError.createAuthenticationError("Token not provided or malformed request in Authorization header"));
        }
        try {
            req.decoded = this.verifyToken(token);
            return next();
        } 
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return next(GenericAppError.createAuthenticationError("Token expired", error));
            }
            return next(GenericAppError.createAuthenticationError("Authentication error", error));
        }
    }


    /**
     * Middleware function that authorizes the user for person requests
     * If the requested person's id does not match the id in the decoded token,
     * it checks if the user has the 'recruiter' role.
     * @param {Object} controller - The controller object
     * @param {Object} req.params.id - The id of the requested person data
     * @param {Object} req.decoded.id - The id in the decoded token
     * @returns {Function} - The middleware function to check if a user is authorized
     * @throws {GenericAppError} - If the user is not authorized
     * @throws {GenericAppError} - If there is an error in the authorization process
     */
    authorizePersonRequest(controller) {
        return async (req, res, next) => {
            if (String(req.params.id) !== String(req.decoded.id)) {
                try {
                    const role = await controller.getUserRole(req.decoded.id);
                    if (role !== 'recruiter') {
                        return next(GenericAppError.createUnauthorizedError(`User[${req.decoded.id}, ${role}] tried accessing user [${req.params.id}]`));
                    }
                } 
                catch (error) {
                    return next(GenericAppError.createInternalServerError("Authorization error", error));
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
     * @
     */
    addTokenToResponse(person){
        try{
            const token = this.generateToken(this.extractUserData(person));
            return {token: token, person:person};
        }
        catch(error){
            throw GenericAppError.createInternalServerError(`Failed to generate token when logging in user [${person.id}`, error);
        }
    }
}
module.exports = AuthHandler;