const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");

suite("Unit Tests", () => {
    let solver = new Solver();
    let puzzleValid =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    let puzzleShort =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
    let puzzleInvalidChar =
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37A";

    let puzzleMatrix = solver.convertToMatrix(puzzle);

    test("Logic handles a valid puzzle string of 81 characters", () => {
        assert.isTrue(solver.validate(puzzleValid).isValid, "true");
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
        assert.isFalse(solver.validate(puzzleInvalidChar).isValid, "False");
        assert.equal(
            solver.validate(puzzleInvalidChar).err,
            "Invalid characters in puzzle"
        );
    });

    test("Logic handles a valid puzzle string of 81 characters", () => {
        assert.isFalse(solver.validate(puzzleShort).isValid, "False");
        assert.equal(
            solver.validate(puzzleShort).err,
            "Expected puzzle to be 81 characters long"
        );
    });
    test("Logic handles a valid row placement", () => {});
});