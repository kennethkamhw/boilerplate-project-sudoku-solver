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
        for (let i = 0; i < 9; i++) {
            let row = [];
            for (let j = 0; j < 9; j++) {
                let cell = puzzleString[i * 9 + j];
                row.push(cell);
            }
            rows.push(row);
        }
        return rows;
    }

    getRegionBoundaries(row, col) {
        let boundaries = {
            row: {
                lower: 0,
                upper: 3,
            },
            col: {
                lower: 0,
                upper: 3,
            },
        };
        if (row >= 6) {
            boundaries.row.lower = 6;
            boundaries.row.upper = 9;
        } else if ((row >= 3) & (row < 6)) {
            boundaries.row.lower = 3;
            boundaries.row.upper = 6;
        } else {
            boundaries.row.lower = 0;
            boundaries.row.upper = 3;
        }
        if (col >= 6) {
            boundaries.col.lower = 6;
            boundaries.col.upper = 9;
        } else if ((col >= 3) & (row < 6)) {
            boundaries.col.lower = 3;
            boundaries.col.upper = 6;
        } else {
            boundaries.col.lower = 0;
            boundaries.col.upper = 3;
        }
        return boundaries;
    }

    getRegion(puzzleMatrix, row, column) {
        let boundaries = this.getRegionBoundaries(row, column);
        let regionArray = [];
        for (let i = boundaries.row.lower; i < boundaries.row.upper; i++) {
            for (let j = boundaries.col.lower; j < boundaries.col.upper; j++) {
                regionArray.push(puzzleMatrix[i][j]);
            }
        }
        return regionArray;
    }

    checkRowPlacement(puzzleMatrix, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (value === +puzzleMatrix[row][i]) {
                return false;
            }
        }

        return true;
    }

    checkColPlacement(puzzleMatrix, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (value === +puzzleMatrix[i][column]) {
                return false;
            }
        }

        return true;
    }

    checkRegionPlacement(puzzleMatrix, row, column, value) {
        for (let cell of this.getRegion(puzzleMatrix, row, column)) {
            if (value === +cell) {
                return false;
            }
        }

        return true;
    }

    solve(puzzleString) {
        let solution = puzzleString;
        let puzzleMatrix = this.convertToMatrix(puzzleString);

        const solveStep = () => {
            for (let p = 0; p < 9; p++) {
                for (let q = 0; q < 9; q++) {
                    if (puzzleMatrix[p][q] === ".") {
                        for (let n = 1; n < 10; n++) {
                            if (
                                this.checkColPlacement(puzzleMatrix, p, q, n) &
                                this.checkRowPlacement(puzzleMatrix, p, q, n) &
                                this.checkRegionPlacement(puzzleMatrix, p, q, n)
                            ) {
                                puzzleMatrix[p][q] = n;
                                solveStep();
                            } else {
                                puzzleMatrix[p][q] = ".";
                            }
                            return;
                        }
                    }
                }
            }
        };

        console.log(puzzleMatrix);
        return solution;
    }
}

module.exports = SudokuSolver;