/**
 * Backend full flow use cases
 */
jest.resetModules();
jest.doMock("../config/database.js", () => require("./mocks/databaseMock.js"));
const db = require("../config/database.js");

const Logger = require("../utils/logger");
jest.mock("../utils/logger");
Logger.mockImplementation(() => ({
    log: jest.fn()
}));

// Models
let Role, Person, Competence, Application, CompetenceProfile, Availability;

// input data
const recruiterEmail = "recruiter@amusementpark.com"
const recruitePassword = "Recruiter1"
const userEmail = "user@test.se"
const userPassword = "Password1"


const setupDummyDB = (async ()=>{
    await Role.create({role_id: 1, name: "recruiter"});
    await Role.create({role_id: 2, name: "applicant"});
    await Competence.create({competence_id: 1, name: "Rollecoaster"})
    await Competence.create({competence_id: 2, name: "Ticket Sales"})
    await Person.create({
        name: "Johanna", 
        surname: "Morgan", 
        pnr: "19930101-1234", 
        email: recruiterEmail,
        password: recruitePassword,
        role_id: 1,
    })
});

describe("Testing Backend full flow use cases with dummy database",()=>{
    let app, request, appinstance;

    beforeAll(async () => {
        await db.init();
        await db.clearDatabase();
        Person = require("../models/personModel");
        Competence = require("../models/competenceModel");
        CompetenceProfile = require("../models/competenceProfileModel");
        Availability = require("../models/availabilityModel.js");
        Role = require("../models/roleModel");
        Application = require("../models/applicationModel");

        await db.syncDatabase();
    
        await setupDummyDB(); 
    
        const server = require("../../server");
        app = server.app;
        appinstance = server;
        request = require("supertest");
    });
    
    


    afterAll(async () =>{
        await appinstance.close()
        await db.clearDatabase();
        await db.closeDatabase();
    });

    describe("Testing Setup",() => {
        test("Should return all schemas from mock db", async () => {
            const tables = [
                { name: "role" },
                { name: "person" },
                { name: "competence" },
                { name: "application" },
                { name: "competence_profile" },
                { name: "availability" }
              ]
            const res = await db.getSequelize().showAllSchemas();
            expect(res).toEqual(tables)
        })
        test("Should return a list of 1 persons if recruiter was created", async () =>{
            const res = await Person.findAll()
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(1); 
        })
        test("Should verify db is mockdb by being of type sqllite", () => {
            const sequelize = db.getSequelize();
            expect(sequelize.options.dialect).toBe("sqlite");
        })
        test("Should return 404 with an invalid route", async () => {
            await request(app).get("/test").expect(404);
        });
        test("Should return 401  if not authenticated", async () => {
            await request(app).get("/api/person/me").expect(401);
        });
        test("Should return 401  if not authenticated", async () => {
            await request(app).get("/api/person/me").set("Authorization", "Bearer dummy-token").expect(401);
        });
        test("Should return 401  if not authenticated", async () => {
            await request(app).get("/api/application/all").set("Authorization", "Bearer dummy-token").expect(401);
        });
    });

    describe("Applicant Use case",() => {
        const person = { 
            name: "John", 
            surname: "Doe", 
            pnr: "19900101-1234", 
            email: userEmail, 
            password: userPassword 
        };
        let token = "dummy"

        const validApplication =  {
            competences: [{ competence_id: 1, years_of_experience: 5 }],
            availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }]
        }

        test("should send reject with invalid input", async() =>{
            await request(app)
            .post("/api/person/create-account")
            .send({name:person.name, surname: person.surname, pnr: "null", email: person.email, password: person.password})
            .expect(400)
        })
        test("should create the person", async() =>{
            const res = await request(app)
            .post("/api/person/create-account")
            .send(person)
            .expect(201)
        })
        test("should login the person and return token", async () => {
            const res = await request(app)
            .post("/api/person/login")
            .send({email: person.email, password: person.password})
            .expect(200)

            expect(res.body.data.token).toBeDefined()
            token = res.body.data.token;
        })
        test("should return person data", async () =>{
            const res= await request(app)
                .get("/api/person/me")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
            expect(res.body.data.pnr).toBe(person.pnr)
        })
        test("should not be able to view recruiter pages", async () => {
            const res= await request(app)
            .get("/api/application/all")
            .set("Authorization", `Bearer ${token}`)
            .expect(401);
        });

        test("should have 0 applications", async () => {
            const res= await request(app)
            .get("/api/application/my-application")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
        })

        test("should create an application", async () => {
            const response = await request(app)
                .post("/api/application/apply")
                .set("Authorization", `Bearer ${token}`)
                .send(validApplication)
                .expect(201)
        })

        test("should return users application", async () => {
            const res= await request(app)
            .get("/api/application/my-application")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

            expect(res.body.data.applicant.email).toBe(person.email)
            expect(res.body.data.competences.competence_id).toBe(validApplication.competences.competence_id)
            expect(res.body.data.status).toBe("unhandled")
        })
    })

    describe("Recruiter use case", () => {
        let token, applicationID;
        test("should login the recruiter", async () => {
            const res = await request(app)
            .post("/api/person/login")
            .send({email: recruiterEmail, password: recruitePassword})
            .expect(200)
            
            expect(res.body.data.person.role).toBe("recruiter")
            expect(res.body.data.token).toBeDefined()
            token = res.body.data.token;
        })
        test("should allow recruite to view recruiter area", async () => {
            const res= await request(app)
            .get("/api/application/all")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(1); 
            expect(res.body.data[0].application_id).toBeDefined()

            applicationID = res.body.data[0].application_id;
        })
        test("should allow to request for the application id", async () => {
            const res= await request(app)
            .get(`/api/application/${applicationID}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

            expect(res.body.data).toBeDefined();
            expect(res.body.data.application_id).toBe(applicationID)
            expect(res.body.data.status).toBe("unhandled")
        })

        test("should update the status of the application", async () => {
            const res = await request(app)
            .patch(`/api/application/${applicationID}/status`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "accepted" })
            .expect(200);

            expect(res.body.data).toBeDefined();
            expect(res.body.data.application_id).toBe(applicationID)
            expect(res.body.data.status).toBe("accepted")
        })

        test("should show the updated status of the application", async () => {
            const res= await request(app)
            .get(`/api/application/${applicationID}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

            expect(res.body.data).toBeDefined();
            expect(res.body.data.application_id).toBe(applicationID)
            expect(res.body.data.status).not.toBe("unhandled")
            expect(res.body.data.status).toBe("accepted")
        })
    })

    
    describe("Rate Limiting Tests", () => {
        
        test("Should block requests after limit is exceeded", async () => {
            const res = await request(app)
            .post("/api/person/login")
            .send({email: recruiterEmail, password: recruitePassword})
            .expect(200)
    
            expect(res.body.data.token).toBeDefined()
            token = res.body.data.token;

            for (let i = 0; i < 101; i++) { 
                await request(app)
                .get("/api/person/me")
                .set("Authorization", `Bearer ${token}`)
            }
            const response = await request(app)
                .get("/api/person/me")
                .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(429); 
        });

        test("Should block requests after limit is exceeded for not logged in user", async () => {
 
            for (let i = 0; i < 101; i++) { 
                await request(app)
                .get("/api/application/all")
                .set("Authorization", `Bearer dummy`)
            }
            const response = await request(app)
                .get("/api/application/apply")
                .set("Authorization", `Bearer dummy`)
            expect(response.status).toBe(429); 
        });
    });
});