/* <-- ALL WIP --> */
export type MatrixLike = number[][] | Float32Array[] | Float64Array[];

import { factorial } from './util.ts';
import { Vec1 } from '../1D/index.ts';
import { Vec2 } from '../2D/index.ts';
import { Vec3 } from '../3D/index.ts';
import { VecN } from '../N/index.ts';

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
				matrix.every((row: number[] | Float32Array | Float64Array) =>
					row.length === matrix.length
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
		// if matrix is 1x1
		if (m.length === 1) {
			return m[0][0];
		}

		// if matrix is 2x2
		if (m.length === 2) {
			return m[0][0] * m[1][1] - m[0][1] * m[1][0];
		}

		// cofactor expansion
		let det = 0;

		// Loop through the first row to apply cofactor expansion
		for (let col = 0; col < m.length; col++) {
			// Create the minor matrix by excluding the current row and column
			const minor = this._minor(m, 0, col);

			// Apply the cofactor expansion formula: det(A) = Σ (-1)^(i+j) * A(i,j) * det(minor)
			const cofactor = Math.pow(-1, col) * m[0][col] *
				this._determinant(minor);
			det += cofactor;
		}

		return det;
	}

	private _minor(m: MatrixLike, i: number, j: number): MatrixLike {
		// Create the minor matrix by excluding the current row and column
		const minor = m.filter((_, row) => row !== i).map((row) =>
			Array.from(row).filter((_, col) => col !== j)
		);

		return minor;
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
		return new Matrix(this._matrix);
	}

	/**
	 * Create a zero matrix.
	 *
	 * @returns Matrix
	 */
	zero() {
		return this._setScalar(0);
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
	 * Apply scalar (λ) to matrix.
	 *
	 * @param scalar scalar number
	 */
	scale(lambda: number): Matrix {
		this._setScalar(lambda);

		return this;
	}

	/**
	 * Column space of matrix.
	 *
	 * @returns VecN[] | Vec1[] | Vec2[] | Vec3[]
	 */
	col(): VecN[] | Vec1[] | Vec2[] | Vec3[] {
		// TODO(@punctuations): add column space function
		
		// make an array of this.cols length, with vectors in this.rows dim.
		const m = this._matrix;
		
		const col_space = [];
		
		// dimension is higher than 3.
		for (let i; i++; i<this.cols) {
			const buffer = [];
			
			for (let j; j++; j<this.rows) {
				buffer.push(m[i][j]);
			}
			
			if (buffer.length == 1) {
				col_space.push(Vec1(buffer));
				continue;
			}
			
			if (buffer.length == 2) {
				col_space.push(Vec2(buffer));
				continue;
			}
			
			if (buffer.length == 3) {
				col_space.push(Vec3(buffer));
				continue;
				}
			
			col_space.push(VecN(buffer));
		}
	}

	/**
	 * Range of the matrix.
	 *
	 * @returns VecN[] | Vec1[] | Vec2[] | Vec3[]
	 */
	range(): VecN[] | Vec1[] | Vec2[] | Vec3[] {
		// TODO(@punctuations): add range function
		const m = this._matrix;
		
		const range = [];
		
		for (let j; j++; j<this.rows) {
			const buffer = [];
			
			for (let i; i++; i<this.cols) {
				buffer.push(m[j][i]
			}
			
			if (buffer.length == 1) {
				range.push(Vec1(buffer));
				continue;
			}
			
			if (buffer.length == 2) {
				range.push(Vec2(buffer));
				continue;
			}
			
			if (buffer.length == 3) {
				range.push(Vec3(buffer));
				continue;
			}
			
			range.push(VecN(buffer));
		}
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

		this._dims = [this._rows, this._cols];

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
	 * Compute the minor of a square matrix.
	 *
	 * @param i row coordinate of matrix
	 * @param j column coordinate of matrix
	 * @returns Matrix
	 */
	minor(i: number, j: number): Matrix {
		if (!this._isSquare) {
			throw new Error('Matrix must be square');
		}

		return new Matrix(this._minor(this._matrix, i, j));
	}

	/**
	 * Compute the adjoint of a square matrix.
	 *
	 * @returns Matrix
	 */
	adjoint(): Matrix {
		if (!this._isSquare) {
			throw new Error('Matrix must be square');
		}

		let adjoint: number[][] = Array(this._rows).fill(null).map(() =>
			Array(this._cols).fill(0)
		);

		for (let i = 0; i < this._rows; i++) {
			for (let j = 0; j < this._cols; j++) {
				adjoint[j][i] = Math.pow(-1, i + j) *
					this._determinant(this._minor(this._matrix, i, j));
			}
		}

		return new Matrix(adjoint);
	}

	/**
	 * Inverse of a square matrix.
	 *
	 * @returns Matrix
	 */
	inverse(): Matrix {
		// TODO(@punctuations): fix inverse, currently broken (could be issue w/ det, adj, minor).
		if (!this._isSquare) {
			throw new Error('Matrix must be square');
		}

		const det = this.determinant();
		if (det === 0) {
			throw new Error('Matrix is not invertible');
		}

		const adjoint = this.adjoint();
		adjoint.scale(1 / det);

		return adjoint;
	}

	/**
	 * Add two matrices. Sum is this matrix.
	 *
	 * @param m1 Matrix
	 * @returns Matrix
	 */
	add(m1: Matrix | MatrixLike): Matrix {
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		}

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
	subtract(m1: Matrix | MatrixLike): Matrix {
		if (m1 instanceof Matrix) {
			m1 = m1._matrix;
		}

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

	/**
	 * base of n, raised to the power of the matrix: n^(A)
	 *
	 * @param base base of the exponentiation
	 * @param k degree of polynomial {@link https://en.wikipedia.org/wiki/Pad%C3%A9_approximant}
	 * @returns Matrix
	 */
	pow(base: number, k?: number): Matrix {
		// check for errors before applying scalar
		if (!this._isSquare) {
			throw new RangeError('Matrix must be square for exp.');
		}

		k = k ?? 1;

		if (typeof k !== 'undefined' && k <= 0) {
			throw new RangeError('Degree of polynomial must be > 0.');
		}

		// power of a normal base is same as: e^(Alog(n)) = n^(A)
		// move into form of Alog(n), we can use exp.
		// n^(A) = e^(Alog(n)) = this.exp(Alog(n))
		this._setScalar(Math.log(base));

		return this.exp(k);
	}

	/**
	 * Matrix exponential (e^A), using Padé approximant.
	 *
	 * @param k degree of polynomial {@link https://en.wikipedia.org/wiki/Pad%C3%A9_approximant}
	 * @returns Matrix
	 */
	exp(k?: number): Matrix {
		if (!this._isSquare) {
			throw new RangeError('Matrix must be square for exp.');
		}

		k = k ?? 1;

		if (typeof k !== 'undefined' && k <= 0) {
			throw new RangeError('Degree of polynomial must be > 0.');
		}

		// Uses Padé approximant
		// e^A = (I + A + A^2/2! + A^3/3! + ... + A^n/n!) for n -> ∞
		// e^A ~= (I + A + A^2/2! + A^3/3! + ... + A^k/k!)/(I - A + A^2/2! - A^3/3! + ... + (-1)^k * A^k/k!)
		// e^A ~= P_k(A)/Q_k(A)

		// since A is a square, rows = cols.
		let I: number[][] = Array(this._rows).fill(null).map((_, i) =>
			Array(this._cols).fill(0).map((_, j) => (i === j ? 1 : 0))
		);

		// if k is not specified (undefined), use the default Padé approximant k = 1
		if (k === 1) {
			// no special polynomial degree
			// e^A = (I + A/2)/(I-A/2)

			this._setScalar(0.5);

			const numerator = this._matrix.map((row, i) =>
				row.map((a, j) => {
					return I[i][j] + a;
				})
			) as MatrixLike;

			const denominator = this._matrix.map((row, i) =>
				row.map((a, j) => {
					return I[i][j] - a;
				})
			) as MatrixLike;

			this._set(numerator);
			this.divide(denominator);

			return this;
		}

		// for k > 1, use the general Padé approximant, make two new matrix instances to add the terms
		const numerator = new Matrix(I).add(this._matrix); // P_k(A)
		const denominator = new Matrix(I).subtract(this._matrix); // Q_k(A)

		for (let i = 2; i <= k; i++) {
			// e^A = (I + A + A^2/2! + A^3/3! + ... + A^k/k!) for n -> ∞
			const A: MatrixLike = this._matrix.map((row, _i) =>
				row.map((a, _j) => {
					return (a ^ k) / factorial(k + 1); // A^k/(k+1)!
				})
			) as MatrixLike;

			numerator.add(A);
			// kinda fucked way of adding (-1)^k, but what can you do
			if (i % 2 === 0) denominator.add(A); // (-1)^k where k is even, so add
			else denominator.subtract(A); // (-1)^k where k is odd, so subtract
		}

		this._set(numerator); // P_k(A)
		this.divide(denominator); // P_k(A)/Q_k(A)
		return this;
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
