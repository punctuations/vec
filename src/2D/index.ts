import { Vec1 } from '../1D/index.ts';
import { Vec3, Vector } from '../3D/index.ts';
import { VecN } from '../N/index.ts';
import { Matrix, type MatrixLike } from '../math/matrix.ts';

export type Vector2Like = Vector | [number, number] | { x: number; y: number };

type Axis2D = 'x' | 'y' | 'i' | 'j';

export interface Vec2Coords {
	x: number;
	y: number;
}

export class Vec2 {
	private _x: number;
	private _y: number;

	private _mag: number = 0;

	readonly length: number = 2;
	readonly dimensions: number = 2;
	readonly isVector2: boolean = true;

	constructor();
	constructor(x: number, y: number);
	constructor(v: Vector2Like);
	constructor(xin?: number | Vector2Like, y?: number) {
		if (xin === undefined) {
			this._x = 0;
			this._y = 0;
		} else if (typeof xin === 'number') {
			// Handle case where individual x, y values are provided
			this._x = xin;
			this._y = y!;
		} else if (
			Array.isArray(xin) ||
			xin instanceof Float32Array ||
			xin instanceof Float64Array ||
			Vec2.isVec2Coords(xin)
		) {
			let [x, y] = this._vectorize(xin);

			this._x = x;
			this._y = y;
		} else {
			throw new Error('Invalid arguments provided for Vec2 constructor');
		}

		this._mag = this._calculateMagnitude();
	}

	private static isVec2Coords(obj: any): obj is Vec2Coords {
		// ensure it is __only__ a 2D vector, not 3D
		return 'x' in obj && 'y' in obj && !('z' in obj);
	}

	private _calculateMagnitude(): number {
		return Math.hypot(this._x, this._y);
	}

	private _vectorize(v: Vector2Like | Vec2): Vector | [number, number] {
		if (v instanceof Vec2) return v.coords;

		if (
			!(v instanceof Float32Array) &&
			!(v instanceof Float64Array) &&
			!Array.isArray(v)
		) {
			return [v.x, v.y];
		} else {
			if (v.length == 2) {
				return v;
			} else {
				throw new Error(
					'Unable to vectorize input: exceeded vector length.',
				);
			}
		}
	}

	get x(): number {
		return this._x;
	}

	set x(value: number) {
		this._x = value;

		this._mag = this._calculateMagnitude();
	}

	get y(): number {
		return this._y;
	}

	set y(value: number) {
		this._y = value;

		this._mag = this._calculateMagnitude();
	}

	get coords(): [number, number] {
		return [this._x, this._y];
	}

	get mag(): number {
		return this._mag;
	}

	/**
	 * Theta is assumed to be in radians.
	 */
	set mag(value: number | { magnitude: number; theta: number }) {
		if (typeof value === 'number') value = { magnitude: value, theta: 0 };
		value.theta = value.theta ?? 0;

		this._mag = value.magnitude;

		this._x = value.magnitude * Math.cos(value.theta);
		this._y = value.magnitude * Math.sin(value.theta);
	}

	get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	/**
	 * Clone this vector into a new vector.
	 *
	 * @returns new Vec2
	 */
	clone() {
		return new Vec2(this._x, this._y);
	}

	/**
	 * Copy the information of another vector to this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	copy(v: Vector2Like | Vec2) {
		v = this._vectorize(v);

		this._x = v[0];
		this._y = v[1];
		this._mag = this._calculateMagnitude();

		return this;
	}

	/**
	 * Zero all coordinates: [0, 0]
	 *
	 * @returns Vec2
	 */
	zero() {
		this._x = 0;
		this._y = 0;

		return this;
	}

	/**
	 * Normalize to a unit vector.
	 *
	 * Note: this will return 0v as unit vector.
	 *
	 * @returns Vec2
	 */
	unit() {
		this._x = this._y = Math.SQRT1_2;

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 *
	 * @returns Vec2
	 */
	antiparallel() {
		this._x = -this._x;
		this._y = -this._y;

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 * (alias function for {@link antiparallel})
	 *
	 * @returns Vec2
	 */
	oppose() {
		return this.antiparallel();
	}

	/**
	 * Performs the dot product against v0 and v1. (v0 ・ v1)
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	dot(v1: Vector2Like | Vec2): number {
		v1 = this._vectorize(v1);

		return this._x * v1[0] + this._y * v1[1];
	}

	/**
	 * Calculate the 2D determinate.
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 * @see https://math.stackexchange.com/questions/3158634/
	 */
	cross(v1: Vector2Like | Vec2): number {
		// cross product does not exist in 2D, see: https://math.stackexchange.com/questions/3158634/
		// rather, we will use wedge product
		return this.wedge(v1);
	}

	/**
	 * Calculate the wedge product for two vectors
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	wedge(v1: Vector2Like | Vec2): number {
		v1 = this._vectorize(v1);

		return this.x * v1[1] - this.y * v1[0];
	}

	/**
	 * Find the distance between two vectors.
	 *
	 * @param v1 Vector
	 * @return distance
	 */
	distance(v1: Vector2Like | Vec2): number {
		v1 = this._vectorize(v1);

		return Math.hypot(this._x - v1[0], this._y - v1[1]);
	}

	/**
	 * Transform the vector such that θ is satisfied, while sustaining the magnitude.
	 *
	 * @param theta angle
	 * @param unit degree/radians
	 * @returns Vec3
	 */
	from(theta: number, unit: 'deg' | 'rad' = 'rad') {
		if (unit.toLowerCase() === 'deg') {
			theta *= Math.PI / 180;
		}

		this._x = this._mag * Math.cos(theta);
		this._y = this._mag * Math.sin(theta);

		return this;
	}

	/**
	 * Rotate the vector by an angle, θ
	 *
	 * @param theta angle of translation
	 * @param unit degree/radians
	 * @returns Vec3
	 */
	rotate(theta?: number, unit: 'deg' | 'rad' = 'rad') {
		theta = theta ?? 0;

		if (unit.toLowerCase() == 'deg') {
			theta *= Math.PI / 180;
		}

		// add translation angle to pre-existing
		theta += Math.atan2(this._y, this._x);

		// call magnitude setter to recalculate (x, y)
		this.mag = { magnitude: this._mag, theta };

		// rotate by angle, if angle not provided use current angle
		return this;
	}

	/**
	 * Get the angle or angles between a positive axis or a vector
	 *
	 * @param a Vector or axis
	 * @param unit degree/radians
	 * @returns angle
	 */
	between(a: Vector2Like | Axis2D, unit: 'deg' | 'rad' = 'rad'): number {
		let theta = 0;

		// !0 => true, ![>0] => false
		if (!this._mag) {
			throw new Error('This vector cannot have magnitude of zero');
		}

		if (a == 'x' || a == 'y' || a == 'i' || a == 'j') {
			switch (a) {
				case 'x':
				case 'i':
					theta = Math.acos(this._x / this._mag);
					break;
				case 'y':
				case 'j':
					theta = Math.acos(this._y / this._mag);
					break;
			}
		} else {
			a = this._vectorize(a);

			// !0 => true, ![>0] => false
			if (!a[0] || !a[1]) {
				throw new Error('Vector cannot have magnitude of zero');
			}

			/*

				since,
					cosθ = (v・v1)/(||v|| * ||v1||)

			*/
			theta = Math.acos(this.dot(a) / (Math.hypot(...a) * this._mag));
		}

		if (unit.toLowerCase() === 'deg') {
			theta *= 180 / Math.PI;
		}

		return theta;
	}

	/**
	 * Max between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec2
	 */
	max(v1: Vector2Like | Vec2) {
		v1 = this._vectorize(v1);

		this._x = Math.max(this._x, v1[0]);
		this._y = Math.max(this._y, v1[1]);

		return this;
	}

	/**
	 * Min between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec2
	 */
	min(v1: Vector2Like | Vec2) {
		v1 = this._vectorize(v1);

		this._x = Math.min(this._x, v1[0]);
		this._y = Math.min(this._y, v1[1]);

		return this;
	}

	/**
	 * Round all coords up
	 *
	 * @returns Vec2
	 */
	ceil() {
		this._x = Math.ceil(this._x);
		this._y = Math.ceil(this._y);

		return this;
	}

	/**
	 * Round all coords down
	 *
	 * @returns Vec2
	 */
	floor() {
		this._x = Math.floor(this._x);
		this._y = Math.floor(this._y);

		return this;
	}

	/**
	 * Round all coords
	 *
	 * @returns Vec2
	 */
	round() {
		this._x = Math.round(this._x);
		this._y = Math.round(this._y);

		return this;
	}

	/**
	 * Clamp coordinates between two vectors, min and max.
	 *
	 * @param min minimum vector
	 * @param max maximum vector
	 * @returns Vec2
	 */
	clamp(min: Vector2Like | Vec2, max: Vector2Like | Vec2) {
		min = this._vectorize(min);
		max = this._vectorize(max);

		// assumes min < max, componentwise

		this._x = Math.max(min[0], Math.min(max[0], this._x));
		this._y = Math.max(min[1], Math.min(max[1], this._y));

		return this;
	}

	/**
	 * Segment vector between two points.
	 * From A to B
	 *
	 * @param A First Point
	 * @param B Second Point
	 * @returns Vec2
	 */
	segvec(A: Vector2Like | Vec2, B: Vector2Like | Vec2) {
		A = this._vectorize(A);
		B = this._vectorize(B);

		this._x = B[0] - A[0];
		this._y = B[1] - A[1];

		return this;
	}

	/**
	 * Add together two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	add(v: Vector2Like | Vec2) {
		v = this._vectorize(v);

		this._x += v[0];
		this._y += v[1];

		return this;
	}

	/**
	 * Subtract two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	sub(v: Vector2Like | Vec2) {
		v = this._vectorize(v);

		this._x -= v[0];
		this._y -= v[1];

		return this;
	}

	/**
	 * Multiply this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec2
	 */
	multiply(s: number) {
		this._x *= s;
		this._y *= s;

		return this;
	}

	/**
	 * Divide this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec2
	 */
	divide(s: number) {
		this._x /= s;
		this._y /= s;

		return this;
	}

	/**
	 * Apply a matrix transformation to this vector.
	 *
	 * @param m Matrix
	 * @returns Vec1 | Vec2 | Vec3 | VecN
	 */
	transform(m: Matrix | MatrixLike): Vec1 | Vec2 | Vec3 | VecN {
		if (!(m instanceof Matrix)) {
			m = new Matrix(m);
		}

		const x = new Matrix([[this._x], [this._y]]);

		const result = m.multiply(x);

		const transform = result.matrix;

		// simple cases
		if (result.rows == 3) {
			return new Vec3(transform[0][0], transform[1][0], transform[2][0]);
		}
		if (result.rows == 2) return new Vec2(transform[0][0], transform[1][0]);
		if (result.rows == 1) return new Vec1(transform[0][0]);

		// result is in the form of [[x1], [x2], ..., [xn]]

		return new VecN(transform.map((v) => v[0]));
	}

	/**
	 * Extend a 2D vector into a 3D space.
	 *
	 * @returns Vec3
	 */
	extend(): Vec3 {
		return new Vec3(this._x, this._y, 0);
	}

	/**
	 * Converts the current vector into VecN
	 *
	 * @returns VecN
	 */
	toVecN(): VecN {
		return new VecN([this._x, this._y]);
	}

	*[Symbol.iterator]() {
		yield this._x;
		yield this._y;
	}
}

export interface Vec2 {
	readonly dimensions: number;
	readonly length: number;
	readonly isVector2: boolean;
	three: {
		set(x: number, y: number): Vec2;
		setX(x: number): Vec2;
		setY(y: number): Vec2;
		applyMatrix3(m: any): Vec2;
		// Add more methods here if needed
	};

	/**
	 * Iterating through a Vector2 instance will yield its components (x, y) in the corresponding order.
	 */
	[Symbol.iterator](): Iterator<number>;
}

/**
 * for backwards compat.
 */
Vec2.prototype.three = {
	set: function (this: Vec2, x: number, y: number): Vec2 {
		this.x = x;
		this.y = y;

		return this;
	},
	setX: function (this: Vec2, x: number): Vec2 {
		this.x = x;

		return this;
	},
	setY: function (this: Vec2, y: number): Vec2 {
		this.y = y;

		return this;
	},
	applyMatrix3: function (this: Vec2, m): Vec2 {
		const x = this.x,
			y = this.y;
		const e = m.elements;

		this.x = e[0] * x + e[3] * y + e[6];
		this.y = e[1] * x + e[4] * y + e[7];

		return this;
	},
};
