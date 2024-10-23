/* <-- ALL WIP --> */
export type MatrixLike = number[][] | Float32Array[] | Float64Array[];

export class Matrix {
	private _rows: number;
	private _cols: number;
	private _matrix: MatrixLike = [];
	private _isSquare: boolean = false;

	private _dims: number[];

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

		this._dims = [this._rows, this._cols];
	}

	private _set(m: Matrix | MatrixLike) {
		if (m instanceof Matrix) {
			m = m.matrix;
		}

		if (m.length === m[0].length) this._isSquare = true;
		else this._isSquare = false;

		this._matrix = m;
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

	get matrix(): MatrixLike {
		return this._matrix;
	}

	get dimensions(): number[] {
		return this._dims;
	}

	get length(): number[] {
		return this._dims;
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

	/**
	 * Add two matrices. Sum is this matrix.
	 *
	 * @param m1 Matrix
	 * @returns Matrix
	 */
	add(m1: MatrixLike): Matrix {
		if (this._isSquare) {
			for (let i = 0; i < m1.length; i++) {
				for (let j = 0; m1[0].length; j++) {
					this._matrix[i][j] += m1[i][j];
				}
			}
		} else {
			throw new Error('Matrix must be square');
		}

		return this;
	}

	/**
	 * Subtract two matrices. Difference is this matrix.
	 *
	 * @param m1 Matrix
	 * @returns Matrix
	 */
	subtract(m1: MatrixLike): Matrix {
		if (this._isSquare) {
			for (let i = 0; i < m1.length; i++) {
				for (let j = 0; m1[0].length; j++) {
					this._matrix[i][j] -= m1[i][j];
				}
			}
		}

		return this;
	}

	/**
	 * Matrix multiplication. Product is this matrix.
	 *
	 * @see https://en.wikipedia.org/wiki/Matrix_multiplication
	 *
	 * @param m1 matrix to multiply
	 * @returns Matrix
	 */
	multiply(m1: Matrix | MatrixLike): Matrix {
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		}

		if (this._cols !== m1.length) {
			throw new RangeError(
				'Matrix multiplication must be in the form of m x n * n x p',
			);
		}

		// will have height of m1 and width of m2

		let A: number[][] = Array(this._rows).fill(null).map(() =>
			Array(m1[0].length).fill(0)
		);

		// new matrix dimensions: m1.rows x m2.cols
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < m1[0].length; j++) {
				for (let k = 0; k < this._cols; k++) {
					A[i][j] += this._matrix[i][k] * m1[k][j];
				}
			}
		}

		this._dims = [this._rows, m1[0].length];
		this._cols = m1[0].length;

		this._set(A);
		return this;
	}

	/**
	 * Matrix division. Quotient is this matrix.
	 *
	 * @param m1 Matrix
	 * @returns Matrix
	 */
	divide(m1: Matrix | MatrixLike) {
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		}

		if (this._cols !== m1.length) {
			throw new RangeError(
				'Matrix division must be in the form of m x n * n x p',
			);
		}

		let A: number[][] = Array(this._rows).fill(null).map(() =>
			Array(m1[0].length).fill(0)
		);

		// new matrix dimensions: m1.rows x m2.cols
		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < m1[0].length; j++) {
				for (let k = 0; k < this._cols; k++) {
					A[i][j] += this._matrix[i][k] / m1[k][j];
				}
			}
		}

		this._dims = [this._rows, m1[0].length];
		this._cols = m1[0].length;

		this._set(A);
		return this;
	}

	/**
	 * Raise matrix to the power of n.
	 *
	 * @param n exponent
	 * @returns Matrix
	 */
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
