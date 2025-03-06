/**
 * Exchage database to mock database
 */
jest.resetModules();
jest.doMock("../../config/database.js", () => require("../mocks/databaseMock.js"));
const db = require("../../config/database.js");
const {clearDatabase} = require("../mocks/databaseMock.js")
let Competence;
const competences= [{ competence_id: 1, name: "Competence One" }, { competence_id: 2, name: "Competence Two" }]

describe("CompetenceDAO", () => {
    let competenceDAO;
    /**
     * Mock db setup
     * Init models by import and instatiate personDAO
     * Create Role for the db to collect.
     */
    beforeAll(async () => {
      await db.setupDatabase();
      Competence = require("../../models/competenceModel");
      const CompetenceDAO = require("../../integration/competenceDAO");
      competenceDAO = new CompetenceDAO();
  
      await db.getSequelize().sync({ force: true });
      
      competences.map(async (comp) => await Competence.create(comp))
    
    });
  
    /**
     * Removes the created Role, terminates connection
     */
    afterAll(async () => {
      await clearDatabase()
      await db.closeDatabase();
      personDAO = null;
    });


    describe("getAllCompetence", () =>{
        test("should return the two listed competences", async () =>{
            const result = await competenceDAO.findAllCompetences();

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(competences.length);
            expect(result[0].dataValues).toEqual(competences[0])
            expect(result[1].dataValues).toEqual(competences[1])
        })

        test("should return one competence if one is removed", async () =>{
            await Competence.destroy({where: {competence_id: 2}})

            const result = await competenceDAO.findAllCompetences();

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(competences.length - 1);
            expect(result[0].dataValues).toEqual(competences[0])
        })
    })
    describe("findById",()=>{
        test("should return a competence with valid id", async () => {
            await expect(competenceDAO.findById(1)).resolves.not.toBeNull();
          });
          
          test("should return null with invalid id", async () => {
            await expect(competenceDAO.findById(9999)).resolves.toBeNull();
          });
    })


});