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

    convertToArray(puzzleString) {
        return puzzleString.split("").map((e) => (e === "." ? 0 : +e));
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
        } else if (row >= 3 && row < 6) {
            boundaries.row.lower = 3;
            boundaries.row.upper = 6;
        } else {
            boundaries.row.lower = 0;
            boundaries.row.upper = 3;
        }
        if (col >= 6) {
            boundaries.col.lower = 6;
            boundaries.col.upper = 9;
        } else if (col >= 3 && row < 6) {
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
            if (+value === +puzzleMatrix[row][i]) {
                return false;
            }
        }

        return true;
    }

    checkColPlacement(puzzleMatrix, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (+value === +puzzleMatrix[i][column]) {
                return false;
            }
        }

        return true;
    }

    checkRegionPlacement(puzzleMatrix, row, column, value) {
        for (let cell of this.getRegion(puzzleMatrix, row, column)) {
            if (+value === +cell) {
                return false;
            }
        }

        return true;
    }

    printMatrix(puzzleMatrix) {
        console.log("Printing Matrix");
        for (let i = 0; i < 9; i++) {
            console.log(puzzleMatrix[i].toString());
        }
    }

    solve(puzzleString) {
        let puzzleValidation = this.validate(puzzleString);
        if (!puzzleValidation.isValid) {
            return { error: puzzleValidation.err };
        }

        let board = [...this.convertToArray(puzzleString)];

        // index of 1d array to row and column
        const indexToRowCol = (index) => {
            return { row: Math.floor(index / 9), col: index % 9 };
        };

        // row, column back to index
        const RowColToindex = (row, col) => row * 9 + col;

        const acceptable = (board, index, value) => {
            let { row, col } = indexToRowCol(index);
            for (let r = 0; r < 9; ++r) {
                if (board[RowColToindex(r, col)] == value) return false;
            }
            for (let c = 0; c < 9; ++c) {
                if (board[RowColToindex(row, c)] == value) return false;
            }

            let r1 = Math.floor(row / 3) * 3;
            let c1 = Math.floor(col / 3) * 3;
            for (let r = r1; r < r1 + 3; ++r) {
                for (let c = c1; c < c1 + 3; ++c) {
                    if (board[RowColToindex(r, c)] == value) return false;
                }
            }
            return true;
        };

        const getChoices = (board, index) => {
            let choices = [];
            for (let value = 1; value <= 9; ++value) {
                if (acceptable(board, index, value)) {
                    choices.push(value);
                }
            }
            return choices;
        };

        const bestBet = (board) => {
            let index,
                moves,
                bestLen = 100;
            for (let i = 0; i < 81; ++i) {
                if (!board[i]) {
                    let m = getChoices(board, i);
                    if (m.length < bestLen) {
                        bestLen = m.length;
                        moves = m;
                        index = i;
                        if (bestLen == 0) break;
                    }
                }
            }
            return { index, moves };
        };

        const solve = () => {
            let { index, moves } = bestBet(board);
            if (index == null) return true;
            for (let m of moves) {
                board[index] = m;
                if (solve()) return true;
            }
            board[index] = 0;
            return false;
        };

        solve();

        let result = board.map((e) => e.toString()).join("");

        console.log(result);
        if (result.includes("0")) {
            return false;
        }

        return result;
    }
}

module.exports = SudokuSolver;