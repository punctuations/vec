/* <-- ALL WIP --> */
export type MatrixLike = number[][] | Float32Array[] | Float64Array[];

export class Matrix {
	private _rows: number;
	private _cols: number;
	private _matrix: MatrixLike = [];
	private _isSquare: boolean = false;

    constructor(matrix: MatrixLike | number) {
        // allow to just specify square dimensions
		if (typeof matrix === 'number') {
			this._rows = matrix;
            this._cols = matrix;
            this._isSquare = true;

			this._setScalar(matrix);
		} else {
			if (matrix.length === 0 || matrix[0].length === 0)
				throw new Error('Invalid matrix: must have at least one element.');

			this._matrix = matrix;
			this._rows = matrix.length;
			this._cols = matrix[0].length;

			// check if all rows have the same number of columns
			if (
				!matrix.every(
					(row: number[] | Float32Array | Float64Array) =>
						row.length === this._cols
				)
			) {
				// matrix is square (2x2, 3x3, 4x4)
				this._isSquare = true;
			}
		}

		Matrix.prototype.dimensions, Matrix.prototype.length = [this._rows, this._cols];
	}

	private _set(m: Matrix | MatrixLike) {
		if (m instanceof Matrix) {
			m = m._matrix;
		}

		if (m.length === m[0].length) this._isSquare = true;

		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < this._cols; j++) {
				this._matrix[i][j] = m[i][j];
			}
		}
	}

	private _setScalar(c: number) {
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < this._cols; j++) {
				this._matrix[i][j] = c;
			}
		}
	}

	get rows() {
		return this._rows;
	}

	set rows(rows: number) {
		if (rows! >= 1)
			throw new Error(
				`Matrix cannot have dimension of ${rows}, rows must be >= 1`
			);

		this._rows = rows;

		// create new this._matrix with new row number
		for (let i = 0; i < rows; i++) {
			if (this._matrix[i] === undefined) {
				// fill in new columns in this row with zero
				for (let j = 0; j < this._cols; j++) {
					this._matrix[i][j] = 0;
				}
			}
		}
	}

	get cols() {
		return this._cols;
	}

	set cols(cols: number) {
		if (cols! >= 1)
			throw new Error(
				`Matrix cannot have dimension of ${cols}, rows must be >= 1`
			);

		this._cols = cols;

		// create new this._matrix with new column number
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (this._matrix[i][j] === undefined) {
					this._matrix[i][j] = 0;
				}
			}
		}
	}

	/**
	 *
	 * Clone this matrix into a new vector.
	 *
	 * @returns new Matrix
	 */
	clone() {
		new Matrix(this._matrix);
	}

	/**
	 *
	 * Create a zero matrix.
	 *
	 * @returns Matrix
	 */
	zero() {
		this._setScalar(0);
	}

	/**
	 *
	 * Creates an identity matrix.
	 *
	 * @returns Matrix
	 */
	identity() {
		// make 1 in diagonal
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < this._cols; j++) {
				if (i === j) {
					this._matrix[i][j] = 1;
				} else {
					this._matrix[i][j] = 0;
				}
			}
		}
	}

	/**
	 * 
	 * Reduce matrix to row echelon form.
	 * 
	 * @param m matrix
	 * 
	 * @returns Matrix
	 */
	rref(m: MatrixLike): Matrix {
		// https://en.wikipedia.org/wiki/Row_echelon_form
	
		// untested!
		let lead = 0;
		for (let r = 0; r < this._rows; r++) {
			if (this._cols <= lead) {
				return new Matrix(m); // Return a valid Matrix instance
			}
			let i = r;
			while (this._matrix[i][lead] === 0) {
				i++;
				if (this._rows === i) {
					i = r;
					lead++;
					if (this._cols === lead) {
						return new Matrix(m); // Return a valid Matrix instance
					}
				}
			}
			let temp = this._matrix[i];
			this._matrix[i] = this._matrix[r];
			this._matrix[r] = temp;
			let val = this._matrix[r][lead];
			for (let j = 0; j < this._cols; j++) {
				this._matrix[r][j] /= val;
			}
			for (let k = 0; k < this._rows; k++) {
				if (k !== r) {
					val = this._matrix[k][lead];
					for (let j = 0; j < this._cols; j++) {
						this._matrix[k][j] -= val * this._matrix[r][j];
					}
				}
			}
			lead++;
		}
	
	
		return new Matrix(m);
	}

	// either return NEW matrix __OR__ change current matrix value
	// return new matrix
	add(m1: MatrixLike): Matrix {
		let m_buffer: number[][] = [];

		if (this._isSquare) {
			for (let i = 0; i < m1.length; i++) {
				for (let j = 0; m1[0].length; j++) {
					m_buffer[i][j] = this._matrix[i][j] + m1[i][j];
				}
			}
		} else {
			throw new Error('Matrix must be square');
		}

		return new Matrix(m_buffer);
	}

	// create alias of 'sub'
	subtract(m1: MatrixLike): Matrix {
		let m_buffer: number[][] = [];

		if (this._isSquare) {
			for (let i = 0; i < m1.length; i++) {
				for (let j = 0; m1[0].length; j++) {
					m_buffer[i][j] = this._matrix[i][j] - m1[i][j];
				}
			}
		}

		return new Matrix(m_buffer);
	}

	// support m x n and n x n matrix multiplication.
	// will have height of m1 and width of m2
	// https://en.wikipedia.org/wiki/Matrix_multiplication
	multiply(m1: MatrixLike | Matrix): Matrix {
		
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		};

		// new matrix dimensions: m1.rows x m2.cols
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < m1[0].length; j++) {
				m1[i][j] = this._matrix[i][j] * m1[i][j];
			}
		}

		this.dimensions = [this._rows, m1[0].length];
		this._cols = m1[0].length;

		this._set(m1);
		return this;
	}

	// create alias of 'div'
	divide(m1: MatrixLike) {}

	power_of(n: number): Matrix {
		// compute matrix multiplication n times
		let matrix: MatrixLike | Matrix = this._matrix;
		for (let i = 0; i < n; i++) {
			matrix = this.multiply(matrix);
		}
		return this;
	}

	// ->> special functions

	// new Matrix([[0, 1], [-1, 0]]).pow(2) => 2^(A), where A is the matrix
	pow(base: number): number {
		return 0;
	}

	// e^[[1,0],[0,1]] || e^(A)
	exp(): number {
		return 0;
	}

	// not sure what the iterable should be yet **
	*[Symbol.iterator]() {

		yield this._rows;
		yield this._cols;
		
	}
}

export interface Matrix {
	dimensions: number[];
	length: number[];
	three: {
		// Add more methods here if needed
	};

	/**
	 * Iterating through a Vector2 instance will yield its components (x, y) in the corresponding order.
	 */
	[Symbol.iterator](): Iterator<number>;
}

export const matrix = {
	new: (m: MatrixLike): Matrix => {
		return new Matrix(m);
	},
	multiply: (m2: number[][]): Matrix => {
		return new Matrix(m2);
	},
	pow: (base: number) => {
		// matrix([[0, 1], [-1, 0]]).pow(2)

		return base;
	},
	exp: () => {
		// e^(A)

		return Math.E;
	},
	// valueOf: () => {
	//     return m;
	// }
};

/*
    i want to be able to do m + m2
    or m * m2, etc...
*/
