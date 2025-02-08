/**
 * Handles person related requests. inherits API.
 * Calls personcontroller for funcitonality
 */

const express = require('express');
const Controller = require('../controller/controller');

const dummyUser = { name: "test", surname: "person", pnr: "12340102-6789", email: "a@finnsinte.ok", password: "passwordA2" };

class PersonAPI {
    constructor() {
        this.router = express.Router();
        this.controller = new Controller();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/get-user-id/:id", this.getAccountByID.bind(this));
        this.router.get("/get-user-name/:name", this.getAccountByName.bind(this));
        this.router.post("/create-account", this.createAccount.bind(this));
    }

    async createAccount(req,res) {
        try {
            const person = await this.controller.createPerson(dummyUser);
            res.json({ message: "Account created", person: person });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAccountByID(req,res) {
        const id = req.params.id || 1;
        try {
            const person = await this.controller.findPersonByID(id);
            res.json({ message: "Account Found", person: person });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAccountByName(req,res) {
        console.log(req.params.name);
        const name = req.params.name || "test";
        try {
            const person = await this.controller.findPersonByName(name);
            res.json({ message: "Account Found", person: person });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PersonAPI().router;