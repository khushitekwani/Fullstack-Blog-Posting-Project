let userModel = require("../models/user-model");
let common = require("../../../../utilities/common");
let responseCode = require("../../../../utilities/response-error-code");
const Validator = require('Validator');
var middleware = require('../../../../middleware/validators');
const { t } = require('localizify');
const conn = require("../../../../config/database");
class user {
    async signup(req, res) {
        req.body = middleware.decryption(req.body);
        var request = req.body;
       
        var rules = {
            login_type: 'required|in:simple,google,facebook'
        }

        if (request.login_type === 'simple') {
            Object.assign(rules, {
                // username: 'required',
                // email: 'required|email',
                // password: 'required|min:6',
                // address: 'required',
                // latitude: 'required',
                // longitude: 'required',
                // profile_image: 'required',
                // language:'required'
            });
        } else {
            Object.assign(rules, {
                email:'required',
                social_id: 'required',
                address: 'required',
                latitude: 'required',
                longitude: 'required',
                language:'required'
            });
        }

        var rulesMessage = {
            required: req.language.required,
            email: req.language.email,
            in: req.language.in,
            min: req.language.min
        }
        var keywords = {
            'password': t('rest_keywords_password')
        }
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage, keywords);
        if (!isValid) {
            return;
        }

        const { code, message, data } = await userModel.signup(req.body);

        return middleware.send_response(req, res, code, message, data);

    }  
    
    async login(req, res) {

        req.body = middleware.decryption(req.body);
        var request = req.body;
        
    
        var rules = {
            login_type: 'required|in:simple,google,facebook'
        };
    
        if (request.login_type === 'simple') {
            Object.assign(rules, {
                email: 'email',
                password: 'required',
                // latitude: 'required',
                // longitude: 'required'
            })
        } else {
            Object.assign(rules, {
                email:'required',
                social_id: 'required'
            })
        }
    
        var rulesMessage = {
            required: req.language.required,
            email: req.language.email,
            in: req.language.in,
            min: req.language.min
        };
    
        var keywords = {
            'password': t('rest_keywords_password'),
        };
    
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage, keywords);
        if (!isValid) {
            return;
        }
    
        const { code, message, data } = await userModel.login(req);
       
        return middleware.send_response(req, res, code, message, data);
    }

    async allPost(req, res) {
        // No need to decrypt or process body since we're not using it
        
        // If pagination is needed, you might want to extract from query parameters instead
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        
        // Add these to the req object so they can be used in the model
        req.page = page;
        req.limit = limit;
        
        // If validation is still needed for query parameters, you can do it here
        // const isValid = await middleware.checkValidationRules(req, res, req.query, rules, rulesMessage);
        // if (!isValid) {
        //     return;
        // }
        
        // Call the model function to get all posts
        const { code, message, data } = await userModel.allPost(req);
        
        // Send the response
        return middleware.send_response(req, res, code, message, data);
    }

    async createPost(req,res){
        console.log(req.body);
        req.body = middleware.decryption(req.body);
        var request = req.body;
    
        var rules = {
            // title: 'required',
            // description:'required',
            // image:'required'
        };
    
        var rulesMessage = {
            required: req.language.required
        };
    
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage);
        if (!isValid) {
            return;
        }
    
        const { code, message, data } = await userModel.createPost(req);
    
        return middleware.send_response(req, res, code, message, data);
    }

    async updatePost(req,res){
        req.body = middleware.decryption(req.body);
        var request = req.body;
    
        var rules = {
            // post_id: 'required',
            // title: 'required',
            // description:'required',
            // image:'required'
        };
    
        var rulesMessage = {
            required: req.language.required
        };
    
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage);
        if (!isValid) {
            return;
        }
    
        const { code, message, data } = await userModel.updatePost(req);
    
        return middleware.send_response(req, res, code, message, data);
    }

    async deletePost(req, res) {
        
        // Decrypt the request body
        // If req.body is already an object, you might need to decrypt differently
        const decryptedBody = middleware.decryption(req.body.encryptedData || req.body);
        req.body = decryptedBody;
        console.log(req.body);
        
        const request = req.body;
    
        // Validation rules - uncomment if needed
        const rules = {
            post_id: 'required' // This should probably be required for deleting a post
        };
    
        const rulesMessage = {
            required: req.language.required
        };
    
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage);
        if (!isValid) {
            return;
        }
    
        // Call the model function to delete the post
        const { code, message, data } = await userModel.deletePost(req);
    
        // Send the response
        return middleware.send_response(req, res, code, message, data);
    }

    async postDetails(req,res){
        req.body = middleware.decryption(req.body);
        var request = req.body;
    
        var rules = {
            post_id: 'required'
        };
    
        var rulesMessage = {
            required: req.language.required
        };
    
        const isValid = await middleware.checkValidationRules(req, res, request, rules, rulesMessage);
        if (!isValid) {
            return;
        }
    
        const { code, message, data } = await userModel.postDetails(req);
    
        return middleware.send_response(req, res, code, message, data);
    }

}
module.exports = new user();