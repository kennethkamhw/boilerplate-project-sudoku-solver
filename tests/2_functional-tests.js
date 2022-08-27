const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const puzzleValid =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const puzzleUnsolveable =
    "1.5..2.84..99.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const puzzleShort =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
const puzzleInvalidChar =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3RA";
const puzzleSolution =
    "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("Functional Tests", () => {
    suite("Integrated tests with chai-http", () => {
        test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post("/api/solve")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzleSolution);
                    done();
                });
        });

        test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post("/api/solve")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: "",
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field missing");
                    done();
                });
        });

        test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post("/api/solve")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleInvalidChar,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                });
        });

        test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post("/api/solve")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleShort,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.body.error,
                        "Expected puzzle to be 81 characters long"
                    );
                    done();
                });
        });

        test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
            chai
                .request(server)
                .post("/api/solve")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleUnsolveable,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Puzzle cannot be solved");
                    done();
                });
        });

        test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "A2",
                    value: 3,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });

        test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "A2",
                    value: 9,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid, "Correct to return False");
                    assert.equal(res.body.conflict.length, 1);
                    done();
                });
        });

        test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "A2",
                    value: 6,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid, "Correct to return False");
                    assert.isAbove(res.body.conflict.length, 1);
                    done();
                });
        });

        test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "H1",
                    value: 1,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid, "Correct to return False");
                    assert.equal(res.body.conflict.length, 3);
                    done();
                });
        });

        test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: "",
                    coordinate: "",
                    value: undefined,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                });
        });

        test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleInvalidChar,
                    coordinate: "A2",
                    value: 5,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                });
        });

        test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleShort,
                    coordinate: "A2",
                    value: 5,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(
                        res.body.error,
                        "Expected puzzle to be 81 characters long"
                    );
                    done();
                });
        });

        test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "Z2",
                    value: 5,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    console.log(res.body);
                    assert.equal(res.body.error, "Invalid coordinate");
                    done();
                });
        });

        test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
            chai
                .request(server)
                .post("/api/check")
                .type("form")
                .set("content-type", "application/json")
                .send({
                    puzzle: puzzleValid,
                    coordinate: "A2",
                    value: 12,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    console.log(res.body);
                    assert.equal(res.body.error, "Invalid value");
                    done();
                });
        });
    });
});