const { validateApplyForJob, validateUpdateStatus } = require("../../utils/applicationValidator");
const GenericAppError = require("../../utils/genericAppError");

describe("ApplyForJobValidator", () => {
    let req, res, next;

    beforeEach(() => {
        res = {};
        next = jest.fn();
    });

    describe("validateApplyForJob", () => {
        test("should pass validation for valid input", () => {
            req = {
                body: {
                    competences: [{ competence_id: 1, years_of_experience: 5 }],
                    availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }]
                }
            };

            validateApplyForJob(req, res, next);
            expect(next).toHaveBeenCalledWith();
        });

        test("should fail validation for invalid input", () => {
            const invalidInputs = [
                //{ competences: [], availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }] },
                //{ competences: [{ competence_id: 1, years_of_experience: 5 }], availabilities: [] },
                { competences: [{ competence_id: 1, years_of_experience: -1 }], availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }] },
                { competences: [{ competence_id: 1, years_of_experience: 51 }], availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }] },
                { competences: [{ competence_id: "a", years_of_experience: 5 }], availabilities: [{ from_date: "2023-01-01", to_date: "2023-12-31" }] },
                { competences: [{ competence_id: 1, years_of_experience: 5 }], availabilities: [{ from_date: "2023-01-01", to_date: "2022-12-31" }] },
                { competences: [{ competence_id: 1, years_of_experience: 5 }], availabilities: [{ from_date: "invalid-date", to_date: "2023-12-31" }] },
                { competences: [{ competence_id: 1, years_of_experience: 5 }], availabilities: [{ from_date: "2023-01-01", to_date: "invalid-date" }] },
            ];

            invalidInputs.forEach(input => {
                req = { body: input };
                validateApplyForJob(req, res, next);
                expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
            });
        });
    });

    describe("validateUpdateStatus", () => {
        const invalidStatuses = [
            { status: "pending" },
            { status: 0 },
            { status: null },
            { status: [] },
            { status: {} },
            { status: undefined },
        ];
    
        const validStatuses = [
            { status: "accepted" },
            { status: "rejected" },
        ];
    
        test("should pass validation for valid input", () => {
            validStatuses.forEach(input => {
                req = { body: input };
                validateUpdateStatus(req, res, next);
                expect(next).toHaveBeenCalledWith();
            });
        });
    
        test("should fail validation for invalid input", () => {
            invalidStatuses.forEach(input => {
                req = { body: input };
                validateUpdateStatus(req, res, next);
                expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
            });
        });
    
        test("should fail validation when status is missing", () => {
            req = { body: {} };
            validateUpdateStatus(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(GenericAppError));
        });
    });

});