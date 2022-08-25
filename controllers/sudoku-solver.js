class SudokuSolver {
    validate(puzzleString) {
        let regex = /[0-9\.]{81}/g;

        if (puzzleString.length != 81) {
            return {
                isValid: false,
                err: "Expected puzzle to be 81 characters long",
            };
        }
        if (!regex.test(puzzleString)) {
            return {
                isValid: false,
                err: "Invalid characters in puzzle",
            };
        }

        return { isValid: true, err: null };
    }

    checkRowPlacement(puzzleString, row, column, value) {}

    checkColPlacement(puzzleString, row, column, value) {}

    checkRegionPlacement(puzzleString, row, column, value) {}

    solve(puzzleString) {
        let solution = puzzleString;
        return solution;
    }
}

module.exports = SudokuSolver;