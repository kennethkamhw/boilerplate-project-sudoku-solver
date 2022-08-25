"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function(app) {
    let solver = new SudokuSolver();

    app.route("/api/check").post((req, res) => {});

    app.route("/api/solve").post((req, res) => {
        let puzzle = req.body.puzzle;

        if (!puzzle) {
            res.json({ error: "Required field missing" });
            return;
        }

        let puzzleValidation = solver.validate(puzzle);

        if (!puzzleValidation.isValid) {
            res.json({ error: puzzleValidation.err });
            return;
        }

        let solution = solver.solve(puzzle);

        if (!solution) {
            res.json({ error: "Puzzle cannot be solved" });
        }
        res.json({
            solution: solution,
        });
    });
};