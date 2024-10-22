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
			if (matrix.length === 0 || matrix[0].length === 0) {
				throw new Error(
					'Invalid matrix: must have at least one element.',
				);
			}

			this._matrix = matrix;
			this._rows = matrix.length;
			this._cols = matrix[0].length;

			// check if all rows have the same number of columns
			if (
				!matrix.every(
					(row: number[] | Float32Array | Float64Array) =>
						row.length === this._cols,
				)
			) {
				// matrix is square (2x2, 3x3, 4x4)
				this._isSquare = true;
			}
		}

		Matrix.prototype.dimensions,
			(Matrix.prototype.length = [this._rows, this._cols]);
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

	private _determinant(m: MatrixLike): number {
		// TODO(@punctuations): implement matrix determinant
		return m[0][0];
	}

	get rows() {
		return this._rows;
	}

	set rows(rows: number) {
		if (rows! >= 1) {
			throw new Error(
				`Matrix cannot have dimension of ${rows}, rows must be >= 1`,
			);
		}

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
		if (cols! >= 1) {
			throw new Error(
				`Matrix cannot have dimension of ${cols}, rows must be >= 1`,
			);
		}

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
	 * Clone this matrix into a new vector.
	 *
	 * @returns new Matrix
	 */
	clone() {
		new Matrix(this._matrix);
	}

	/**
	 * Create a zero matrix.
	 *
	 * @returns Matrix
	 */
	zero() {
		this._setScalar(0);
	}

	/**
	 * Creates an identity matrix.
	 *
	 * @returns Matrix
	 */
	identity() {
		// make 1 in diagonal
		this._setScalar(0);

		for (let i = 0; i < this._rows; i++) {
			this._matrix[i][i] = 1;
		}

		return this;
	}

	/**
	 * Transpose matrix (i.e. swap rows -> cols)
	 *
	 * @returns Matrix
	 */
	transpose(): Matrix {
		// three bitwise xors to swap rows <-> cols
		this._rows = this._rows ^ this._cols;
		this._cols = this._rows ^ this._cols;
		this._rows = this._rows ^ this._cols;

		const m = Array(this._rows).fill(null).map(() =>
			Array(this._cols).fill(0)
		);

		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < this._cols; j++) {
				m[i][j] = this._matrix[j][i];
			}
		}

		this._matrix = m;

		return this;
	}

	/**
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

	/**
	 * Compute the determinant of a square matrix.
	 *
	 * @returns number
	 */
	determinant(): number {
		if (!this._isSquare) {
			throw new Error('Matrix must be square');
		}

		return this._determinant(this._matrix);
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
		}

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
	divide(m1: MatrixLike) {
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		}

		// new matrix dimensions: m1.rows / m2.cols
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < m1[0].length; j++) {
				m1[i][j] = this._matrix[i][j] / m1[i][j];
			}
		}

		this.dimensions = [this._rows, m1[0].length];
		this._cols = m1[0].length;

		this._set(m1);
		return this;
	}

	power_of(n: number): Matrix {
		if (n === 0) return this.identity();

		// compute matrix multiplication n times
		for (let i = 0; i < n - 1; i++) {
			// have to iterate for n - 1 since for loop i < n,
			// where n = 1 will result in A^2.
			this.multiply(this._matrix);
		}

		return this;
	}

	// ->> special functions

	// new Matrix([[0, 1], [-1, 0]]).pow(2) => 2^(A), where A is the matrix
	pow(base: number): number {
		// TODO(@punctuations): implement matrix exponentiation
		return base;
	}

	// e^[[0,-1],[1,0]] || e^(A)
	exp(): number {
		// TODO(@punctuations): implement e^(A) exponentiation
		if (!this._isSquare) {
			throw new RangeError('Matrix must be square for exp.');
		}

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
		//TODO(@punctuations): add backwards compat. + implement methods
		makeOrthographic(
			left: number,
			right: number,
			top: number,
			bottom: number,
			near: number,
			far: number,
		): Matrix;
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
