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

    convertToMatrix(puzzleString) {
      let rows = [];
      for (let i=0; i<9; i++) {
        let row = []
        for (let j=0; j<9; j++) {
          let cell = puzzleString[i*9+j];
          console.log(cell);
          row.push(cell);
        }
        rows.push(row);
      }
      console.log(rows);
      return rows;
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