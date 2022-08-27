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
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3RA";

    let puzzleMatrix = solver.convertToMatrix(puzzleValid);

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

    test("Logic handles a valid row placement", () => {
        assert.isTrue(solver.checkRowPlacement(puzzleMatrix, 0, 1, 3));
    });

    test("Logic handles an invalid row placement", () => {
        assert.isFalse(solver.checkRowPlacement(puzzleMatrix, 0, 1, 8));
    });

    test("Logic handles a valid column placement", () => {
        assert.isTrue(solver.checkColPlacement(puzzleMatrix, 0, 1, 3));
    });

    test("Logic handles an invalid column placement", () => {
        assert.isFalse(solver.checkColPlacement(puzzleMatrix, 0, 1, 9));
    });
    test("Logic handles a valid region (3x3 grid) placement", () => {
        assert.isTrue(solver.checkRegionPlacement(puzzleMatrix, 0, 1, 3));
    });

    test("Logic handles an invalid region (3x3 grid) placement", () => {
        assert.isFalse(solver.checkRegionPlacement(puzzleMatrix, 0, 1, 6));
    });

    test("Valid puzzle strings pass the solver", () => {
        assert.isString(solver.solve(puzzleValid));
    });

    test("Invalid puzzle strings fail the solver", () => {
        assert.isNotString(solver.solve(puzzleInvalidChar));
    });

    test("Solver returns the expected solution for an incomplete puzzle", () => {
        assert.equal(
            solver.solve(puzzleValid),
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
        );
    });
});