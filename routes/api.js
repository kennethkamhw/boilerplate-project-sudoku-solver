"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function(app) {
    app.route("/api/check").post((req, res) => {
        let solver = new SudokuSolver();

        let puzzle = req.body.puzzle;
        let coordinate = req.body.coordinate;
        let value = req.body.value;

        if (!coordinate | !value | !puzzle) {
            res.json({ error: "Required field(s) missing" });
            return;
        }

        let puzzleValidation = solver.validate(puzzle);
        if (!puzzleValidation.isValid) {
            res.json({ error: puzzleValidation.err });
            return;
        }

        const regexCoordinate = /^[A-I]{1}[1-9]{1}$/;
        if (!regexCoordinate.test(coordinate)) {
            res.json({ error: "Invalid coordinate" });
            return;
        }

        const regexValue = /^[1-9]{1}$/;
        if (!regexValue.test(value)) {
            res.json({ error: "Invalid value" });
            return;
        }

        console.log(`coordinate = ${coordinate}`);
        let row = coordinate.charCodeAt(0) - 65;
        let column = coordinate[1] - 1;

        console.log(`row = ${row}, column = ${column}`);
        let puzzleMatrix = solver.convertToMatrix(puzzle);

        if (puzzleMatrix[row][column] != ".") {
            if (+puzzleMatrix[row][column] === +value) {
                res.json({ valid: true });
                return;
            } else {
                res.json({ value: false });
                return;
            }
        }

        let rowValid = solver.checkRowPlacement(puzzleMatrix, row, column, value);
        let colValid = solver.checkColPlacement(puzzleMatrix, row, column, value);
        let regionValid = solver.checkRegionPlacement(
            puzzleMatrix,
            row,
            column,
            value
        );
        let result = {
            valid: rowValid && colValid && regionValid,
        };
        console.log(rowValid);
        let conflict = [];
        if (!rowValid) {
            conflict.push("row");
        }
        if (!colValid) {
            conflict.push("column");
        }
        if (!regionValid) {
            conflict.push("region");
        }
        if (!result.valid) {
            result.conflict = conflict;
        }

        res.json(result);
    });

    app.route("/api/solve").post((req, res) => {
        let puzzle = req.body.puzzle;

        let solver = new SudokuSolver();

        // Check if input empty
        if (!puzzle) {
            res.json({ error: "Required field missing" });
            return;
        }

        // Check if charater and length correct
        let puzzleValidation = solver.validate(puzzle);
        if (!puzzleValidation.isValid) {
            res.json({ error: puzzleValidation.err });
            return;
        }

        let solution = solver.solve(puzzle);
        if (!solution) {
            res.json({ error: "Puzzle cannot be solved" });
        } else {
            res.json({
                solution: solution,
            });
        }
    });
};