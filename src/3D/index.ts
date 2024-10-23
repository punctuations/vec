import { Vec1 } from '../1D/index.ts';
import { Vec2 } from '../2D/index.ts';
import { VecN } from '../index.ts';
import { Matrix, type MatrixLike } from '../math/matrix.ts';

export type Vector = Float32Array | Float64Array;
export type Vector3Like =
	| Vector
	| [number, number, number]
	| { x: number; y: number; z: number }
	| { i: number; j: number; k: number };
export type Camera =
	| { x: number; y: number; z: number }
	| { i: number; j: number; k: number }; // | * add threejs camera

type Axis = 'x' | 'y' | 'z' | 'i' | 'j' | 'k';

export interface Vec3Coords {
	x: number;
	y: number;
	z: number;
}

export class Vec3 {
	private _x: number;
	private _y: number;
	private _z: number;

	private _mag: number = 0;

	readonly length: number = 3;
	readonly dimensions: number = 3;
	readonly isVector3: boolean = true;

	constructor();
	constructor(x: number, y: number, z: number);
	constructor(v: Vector3Like);
	constructor(xin?: number | Vector3Like, y?: number, z?: number) {
		if (xin === undefined) {
			this._x = 0;
			this._y = 0;
			this._z = 0;
		} else if (typeof xin === 'number') {
			// Handle case where individual x, y, z values are provided
			this._x = xin;
			this._y = y!;
			this._z = z!;
		} else if (
			Array.isArray(xin) ||
			xin instanceof Float32Array ||
			xin instanceof Float64Array ||
			Vec3.isVec3Coords(xin)
		) {
			let [x, y, z] = this._vectorize(xin);

			this._x = x;
			this._y = y;
			this._z = z;
		} else {
			throw new Error('Invalid arguments provided for Vec3 constructor');
		}

		this._mag = this._calculateMagnitude();
	}

	private static isVec3Coords(obj: any): obj is Vec3Coords {
		return (
			('x' in obj && 'y' in obj && 'z' in obj) ||
			('i' in obj && 'j' in obj && 'k' in obj)
		);
	}

	private _calculateMagnitude(): number {
		return Math.hypot(this._x, this._y, this._z);
	}

	private _vectorize(v: Vector3Like): Vector | [number, number, number] {
		if (
			!(v instanceof Float32Array) &&
			!(v instanceof Float64Array) &&
			!Array.isArray(v)
		) {
			if ('x' in v) {
				return [v.x, v.y, v.z];
			} else if ('i' in v) {
				return [v.i, v.j, v.k];
			} else {
				throw new Error('Not a valid Vector input.');
			}
		} else {
			if (v.length == 3) {
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

	get z(): number {
		return this._z;
	}

	set z(value: number) {
		this._z = value;

		this._mag = this._calculateMagnitude();
	}

	get coords(): [number, number, number] {
		return [this._x, this._y, this._z];
	}

	get cylinder(): [number, number, number] {
		let p = Math.hypot(this._x, this._y);
		let phi = Math.atan2(this._y, this._x);
		let z = this._z;

		return [p, phi, z];
	}

	get sphere(): [number, number, number] {
		let r = Math.hypot(this._x, this._y, this._z);
		let theta = Math.atan2(this._y, this._x);

		/* can use atan2(√(x²+y²)/z) as well, but less calculations required this way */
		let phi = Math.acos(this._z / this._mag);

		return [r, theta, phi];
	}

	get mag(): number {
		return this._mag;
	}

	// https://stackoverflow.com/questions/16451723/get-coordinates-of-a-point-in-3d-space-from-angles-its-vector-makes-with-axis-an
	set mag(value: { magnitude: number; theta?: number; phi?: number }) {
		value.theta = value.theta ?? 0;
		value.phi = value.phi ?? 0;

		this._mag = value.magnitude;

		/*
			mathematics convention (r, θ, φ)
			-> https://en.wikipedia.org/wiki/Spherical_coordinate_system
		*/
		this._x = value.magnitude * Math.sin(value.phi) * Math.cos(value.theta);
		this._y = value.magnitude * Math.sin(value.phi) * Math.sin(value.theta);
		this._z = value.magnitude * Math.cos(value.phi);
	}

	/**
	 * Clone this vector into a new vector.
	 *
	 * @returns new Vec3
	 */
	clone() {
		return new Vec3(this._x, this._y, this._z);
	}

	/**
	 * Copy the information of another vector to this vector.
	 *
	 * @param v Vector
	 * @returns Vec3
	 */
	copy(v: Vector3Like) {
		v = this._vectorize(v);

		this._x = v[0];
		this._y = v[1];
		this._z = v[2];

		return this;
	}

	/**
	 * Zero all coordinates: [0, 0, 0]
	 *
	 * @returns Vec3
	 */
	zero() {
		this._x = 0;
		this._y = 0;
		this._z = 0;

		return this;
	}

	/**
	 * Normalize to a unit vector.
	 *
	 * @returns Vec3
	 */
	unit() {
		this._x, this._y, (this._z = 1 / Math.sqrt(3));

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 *
	 * @returns Vec3
	 */
	antiparalell() {
		this._x = -this._x;
		this._y = -this._y;
		this._z = -this._z;

		return this;
	}

	/**
	 * Reverse the direction of all axis, such that it is anti-parallel
	 * @see (alias function for {@link antiparalell})
	 *
	 * @returns Vec3
	 */
	oppose() {
		this.antiparalell();
	}

	/**
	 * Performs the dot product against v0 and v1. (v0 ・ v1)
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	dot(v1: Vector3Like) {
		v1 = this._vectorize(v1);

		let sx = this._x * v1[0];
		let sy = this._y * v1[1];
		let sz = this._z * v1[2];

		return Math.hypot(sx, sy, sz);
	}

	/**
	 * Returns a new vector perpendicular to v0 and v1.
	 *
	 * @param v1 Vector
	 * @returns new Vector
	 */
	cross(v1: Vector3Like): Vector {
		v1 = this._vectorize(v1);

		let v2 = new Float64Array(3);

		v2[0] = this._y * v1[2] - this._z * v1[1];
		v2[1] = this._z * v1[0] - this._x * v1[2];
		v2[2] = this._x * v1[1] - this._y * v1[0];

		return v2;
	}

	/**
	 * Returns outer product (direct product) of two vectors.
	 *
	 * @param v1 Vector
	 * @returns new Matrix
	 */
	outer(v1: Vector3Like): Matrix {
		v1 = this._vectorize(v1);

		return new Matrix([
			[this._x * v1[0], this._x * v1[1], this._x * v1[2]],
			[this._y * v1[0], this._y * v1[1], this._y * v1[2]],
			[this._z * v1[0], this._z * v1[1], this._z * v1[2]],
		]);
	}

	/**
	 * Returns outer product (direct product) of two vectors.
	 * @see (alias function for {@link outer})
	 *
	 * @param v1 Vector
	 * @returns new Matrix
	 */
	direct(v1: Vector3Like): Matrix {
		return this.outer(v1);
	}

	/**
	 * Find the distance between two vectors.
	 *
	 * @param v1 Vector
	 * @return distance
	 */
	distance(v1: Vector3Like): number {
		v1 = this._vectorize(v1);

		return Math.hypot(
			this._x ** 2 - v1[0] ** 2,
			this._y ** 2 - v1[1] ** 2,
			this._z ** 2 - v1[2] ** 2,
		);
	}

	/**
	 * Transform the vector such that θ and φ are satisfied, while sustaining the magnitude. (Mathematics convention used)
	 *
	 * @param theta azimuthal angle (x - y)
	 * @param phi inclination/polar angle (z - xy)
	 * @param unit degree/radians
	 * @returns Vec3
	 *
	 * @see https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 */
	from(
		angle: [number, number] | [number] | number,
		phi?: number,
		unit: 'deg' | 'rad' = 'rad',
	) {
		let theta;

		if (Array.isArray(angle)) {
			theta = angle.length > 0
				? unit.toLowerCase() == 'deg'
					? (angle[0] * Math.PI) / 180
					: angle[0]
				: Math.atan2(this._y, this._x);
			phi = angle.length == 2
				? unit.toLowerCase() == 'deg'
					? (angle[0] * Math.PI) / 180
					: angle[1]
				: Math.acos(this._z / this._mag);
		} else {
			theta = unit.toLowerCase() == 'deg'
				? (angle * Math.PI) / 180
				: angle;
			phi = phi ?? Math.acos(this._z / this._mag);
		}

		/*
			mathematics convention (r, θ, φ)
			-> https://en.wikipedia.org/wiki/Spherical_coordinate_system
		*/
		this._x = this._mag * Math.sin(phi) * Math.cos(theta);
		this._y = this._mag * Math.sin(phi) * Math.sin(theta);
		this._z = this._mag * Math.cos(phi);

		return this;
	}

	/**
	 * Rotate the vector by an angle, or angles (Mathematics convention used)
	 *
	 * @param theta azimuthal angle (x - y)
	 * @param phi inclination/polar angle (z - xy)
	 * @param unit degree/radians
	 * @returns Vec3
	 */
	rotate(theta?: number, phi?: number, unit: 'deg' | 'rad' = 'rad') {
		theta = theta ?? 0;
		phi = phi ?? Math.acos(this._z / this._mag);

		if (unit.toLowerCase() == 'deg') {
			theta *= Math.PI / 180;
			phi *= Math.PI / 180;
		}

		theta += Math.atan2(this._y, this._x);
		phi += Math.acos(this._z / this._mag);

		this.mag = { magnitude: this._mag, theta, phi };

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
	between(a: Vector3Like | Axis, unit: 'deg' | 'rad' = 'rad') {
		let theta = 0;

		// !0 => true, ![>0] => false
		if (!this._mag) {
			throw new Error('This vector cannot have magnitude of zero');
		}

		if (
			a == 'x' || a == 'y' || a == 'z' || a == 'i' || a == 'j' || a == 'k'
		) {
			/*

				since,
					cosθ = (v・v1)/(||v|| * ||v1||)

				however, since it is along the axis we can replace v1 with the value of 1, lying in the direction of the axis.

			*/
			switch (a) {
				case 'x':
				case 'i':
					theta = Math.acos(this._x / this._mag);
					break;
				case 'y':
				case 'j':
					theta = Math.acos(this._y / this._mag);
					break;
				case 'z':
				case 'k':
					theta = Math.acos(this._z / this._mag);
					break;
			}
		} else {
			a = this._vectorize(a);

			// !0 => true, ![>0] => false
			if (!a[0] || !a[1] || !a[2]) {
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
	 * Segment vector between two points.
	 * From A to B
	 *
	 * @param A First Point
	 * @param B Second Point
	 * @returns Vec2
	 */
	segvec(A: Vector3Like, B: Vector3Like) {
		A = this._vectorize(A);
		B = this._vectorize(B);

		this._x = B[0] - A[0];
		this._y = B[1] - A[1];
		this._z = B[2] - A[2];

		return this;
	}

	/**
	 * Max between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec3
	 */
	max(v1: Vector3Like) {
		v1 = this._vectorize(v1);

		this._x = Math.max(this._x, v1[0]);
		this._y = Math.max(this._y, v1[1]);
		this._z = Math.max(this._z, v1[2]);

		return this;
	}

	/**
	 * Min between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec3
	 */
	min(v1: Vector3Like) {
		v1 = this._vectorize(v1);

		this._x = Math.min(this._x, v1[0]);
		this._y = Math.min(this._y, v1[1]);
		this._z = Math.min(this._z, v1[2]);

		return this;
	}

	/**
	 * Round all coords up
	 *
	 * @returns Vec3
	 */
	ceil() {
		this._x = Math.ceil(this._x);
		this._y = Math.ceil(this._y);
		this._z = Math.ceil(this._z);

		return this;
	}

	/**
	 * Round all coords down
	 *
	 * @returns Vec3
	 */
	floor() {
		this._x = Math.floor(this._x);
		this._y = Math.floor(this._y);
		this._z = Math.floor(this._z);

		return this;
	}

	/**
	 * Round all coords
	 *
	 * @returns Vec3
	 */
	round() {
		this._x = Math.round(this._x);
		this._y = Math.round(this._y);
		this._z = Math.round(this._z);

		return this;
	}

	/**
	 * Clamp coordinates between two vectors, min and max.
	 *
	 * @param min minimum vector
	 * @param max maximum vector
	 * @returns Vec3
	 */
	clamp(min: Vector3Like, max: Vector3Like) {
		min = this._vectorize(min);
		max = this._vectorize(max);

		// assumes min < max, componentwise

		this._x = Math.max(min[0], Math.min(max[0], this._x));
		this._y = Math.max(min[1], Math.min(max[1], this._y));
		this._z = Math.max(min[2], Math.min(max[2], this._z));

		return this;
	}

	/**
	 * Add together two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec3
	 */
	add(v: Vector3Like) {
		v = this._vectorize(v);

		this._x += v[0];
		this._y += v[1];
		this._z += v[2];

		return this;
	}

	/**
	 * Subtract two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec3
	 */
	sub(v: Vector3Like) {
		v = this._vectorize(v);

		this._x -= v[0];
		this._y -= v[1];
		this._z -= v[2];

		return this;
	}

	/**
	 * Multiply this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec3
	 */
	multiply(s: number) {
		this._x *= s;
		this._y *= s;
		this._z *= s;

		return this;
	}

	/**
	 * Divide this vector by a scalar, `s`.
	 *
	 * @param s Scalar
	 * @returns Vec3
	 */
	divide(s: number) {
		this._x /= s;
		this._y /= s;
		this._z /= s;

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

		const x = new Matrix([[this._x], [this._y], [this._z]]);

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
	 * Project the 3D Vector onto a 2D plane.
	 *
	 * @param axis x, y, or z (also can use i, j, k)
	 * @param angle yaw, pitch of the camera as alpha and beta
	 * @returns new Vec2
	 * @see https://blog.mattt.space/p/vec-projection
	 */
	project(
		coords: Axis | Camera,
		angle?: { alpha: number; beta: number },
		unit: 'deg' | 'rad' = 'rad',
	) {
		/* Projection coordinates */
		let px;
		let py;

		if (
			coords == 'x' ||
			coords == 'y' ||
			coords == 'z' ||
			coords == 'i' ||
			coords == 'j' ||
			coords == 'k'
		) {
			switch (coords) {
				case 'x':
				case 'i':
					px = this._x;
					py = this._z;
					break;
				case 'y':
				case 'j':
					px = this._y;
					py = this._z;
					break;
				case 'z':
				case 'k':
					px = this._x;
					py = this._y;
					break;
				default:
					throw new Error('Invalid dimensions for projection.');
			}
		} else {
			// camera object
			let unitConversion = unit.toLowerCase() == 'deg'
				? Math.PI / 180
				: 1;

			angle = {
				alpha: unitConversion * (angle?.alpha ?? 0),
				beta: unitConversion * (angle?.beta ?? 0),
			};

			let v = this._vectorize(coords);

			/* Camera coordinates */
			let cx = v[0];
			let cy = v[1];
			let cz = v[2];

			let d = Math.hypot(cx - v[0], cy - v[1], cz - v[2]);

			/* convert to spherical for yaw and pitch */
			let r = Math.hypot(cx, cy, cz);
			let theta = Math.atan2(cy, cx) + angle.alpha;
			let phi = Math.acos(cz / Math.hypot(cx, cy, cz)) +
				angle
					.beta; /* can use atan(√(x²+y²)/z) as well, but less calculations required this way */

			/*
				c vector coordinates, this is the normal vector.

				The direction of c determines where the plane will be cast, therefore making it the normal vector.
			*/
			cx = r * Math.sin(phi) * Math.cos(theta);
			cy = r * Math.sin(phi) * Math.sin(phi);
			cz = r * Math.cos(phi);

			/*
				calculate the projection from c unto v

				proj_c(v) = [(v dot c)/(c dot c)] * c
			*/
			let projcVScalar = (v[0] * cx + v[1] * cy + v[2] * cz) /
				(cx ** 2 + cy ** 2 + cz ** 2);

			/* projection c unto v coordinates; c projection */
			let cpx = projcVScalar * cx;
			let cpy = projcVScalar * cy;
			// let cpz = projcVScalar * cz; (will be same length as v[3] or vz)

			/*
				projection vector!! this is the meat and potatoes
					+ scale factor, accounting for distance of camera
					see:
			*/
			px = d ? (v[0] - cpx) / d : 0;
			py = d ? (v[1] - cpy) / d : 0;
			// pz = v[2] - cpz (this does not need to be added as it will sum to zero)
		}

		return new Vec2(px, py);
	}

	/**
	 * Convert 3D vector into 2D vector by removing the z-axis.
	 *
	 * @returns Vec2
	 */
	flatten() {
		// theta between x - y, using spherical coordinate system
		let theta = Math.atan2(this._y, this._x);

		let tx = this._mag * Math.cos(theta);
		let ty = this._mag * Math.sin(theta);

		return new Vec2(tx, ty);
	}

	*[Symbol.iterator]() {
		yield this._x;
		yield this._y;
		yield this._z;
	}

	*[Symbol.length]() {
		yield this.dimensions;
	}
}

export interface Vec3 {
	readonly dimensions: number;
	readonly length: number;
	readonly isVector3: boolean;
	three: {
		set(x: number, y: number, z: number): Vec3;
		setX(x: number): Vec3;
		setY(y: number): Vec3;
		setZ(z: number): Vec3;
		/**
		 * THREEJS method
		 *
		 * @returns manhattan length
		 * @see https://threejs.org/docs/#api/en/math/Vector3.manhattanLength
		 * @see https://en.wikipedia.org/wiki/Taxicab_geometry
		 */
		manhattanLength(): number;
		project(camera: any): Vec3;
		unproject(camera: any): Vec3;
		applyMatrix4(m: any): Vec3;
		// Add more methods here if needed
	};

	/**
	 * Iterating through a Vector3 instance will yield its components (x, y, z) in the corresponding order.
	 */
	[Symbol.iterator](): Iterator<number>;
}

/**
 * for backwards compat.
 */
Vec3.prototype.three = {
	set: function (this: Vec3, x: number, y: number, z: number): Vec3 {
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	},
	setX: function (this: Vec3, x: number): Vec3 {
		this.x = x;

		return this;
	},
	setY: function (this: Vec3, y: number): Vec3 {
		this.y = y;

		return this;
	},
	setZ: function (this: Vec3, z: number): Vec3 {
		this.z = z;

		return this;
	},
	manhattanLength: function (this: Vec3): number {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	},
	project: function (this: Vec3, camera) {
		return this.three
			.applyMatrix4(camera.matrixWorldInverse)
			.three.applyMatrix4(camera.projectionMatrix);
	},
	unproject: function (this: Vec3, camera) {
		return this.three
			.applyMatrix4(camera.projectionMatrixInverse)
			.three.applyMatrix4(camera.matrixWorld);
	},
	applyMatrix4: function (this: Vec3, m): Vec3 {
		const x = this.x,
			y = this.y,
			z = this.z;
		const e = m.elements;

		const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

		return this;
	},
};
