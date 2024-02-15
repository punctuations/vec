import { Vec3, Vector } from "../3D";

export type Vector2Like = Vector | [number, number] | { x: number, y: number };

type Axis2D = 'x' | 'y' | 'i' | 'j';

export interface Vec2Coords {
	x: number;
	y: number;
}

export class Vec2 {
    private _x: number;
	private _y: number;

	private _mag: number = 0;

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

		Vec3.prototype.dimensions, Vec3.prototype.length = 2;
    }
    
	private static isVec2Coords(obj: any): obj is Vec2Coords {
		// ensure it is __only__ a 2D vector, not 3D
		return 'x' in obj && 'y' in obj && !('z' in obj);
	}

	private _calculateMagnitude(): number {
		return Math.hypot(this._x, this._y);
	}

	private _vectorize(v: Vector2Like): Vector | [number, number] {
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
				throw new Error('Unable to vectorize input: exceeded vector length.')
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

	set mag(value: {magnitude: number, theta?: number}) {
		value.theta = value.theta ?? 0;

		this._mag = value.magnitude;

		this._x = value.magnitude * Math.cos(value.theta)
		this._y = value.magnitude * Math.sin(value.theta);
	}

	get angle(): number {
		return Math.atan2(this._y, this._x);
	}

	/**
	 *
	 * Clone this vector into a new vector.
	 *
	 * @returns new Vec2
	 */
	clone() {
		return new Vec2(this._x, this._y);
	}

	/**
	 *
	 * Copy the information of another vector to this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	copy(v: Vector2Like) {
		v = this._vectorize(v);

		this._x = v[0];
		this._y = v[1];

		return this;
	}

	/**
	 *
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
	 *
	 * Normalize to a unit vector.
	 *
	 * @returns Vec2
	 */
	unit() {
		this._x, this._y = Math.SQRT1_2;

		return this;
	}

	/**
	 *
	 * Reverse the direction of all axis, such that it is anti-parallel
	 *
	 * @returns Vec2
	 */
	antiparalell() {
		this._x = -this._x;
		this._y = -this._y;

		return this;
	}

	/**
	 *
	 * Reverse the direction of all axis, such that it is anti-parallel
	 * (alias function for vec.antiparallel)
	 *
	 * @returns Vec2
	 */
	oppose() {
		return this.antiparalell();
	}

	/**
	 *
	 * Performs the dot product against v0 and v1. (v0 ・ v1)
	 *
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	dot(v1: Vector2Like) {
		v1 = this._vectorize(v1);

		let sx = this._x * v1[0];
		let sy = this._y * v1[1];

		return Math.hypot(sx, sy);
	}
	
	/**
	 * 
	 * Calculate the 2D determinate.
	 * 
	 * @param v1 Vector
	 * @returns Scalar value
	 * @see https://math.stackexchange.com/questions/3158634/
	 */
	cross(v1: Vector2Like) {

		// cross product does not exist in 2D, see: https://math.stackexchange.com/questions/3158634/
		// rather, we will use wedge product
		return this.wedge(v1);
	}

	/**
	 * 
	 * Calculate the wedge product for two vectors
	 * 
	 * @param v1 Vector
	 * @returns Scalar value
	 */
	wedge(v1: Vector2Like) {
		v1 = this._vectorize(v1);

		return this.x * v1[1] - this.y * v1[0];
	}

	/**
	 * 
	 * Find the distance between two vectors.
	 * 
	 * @param v1 Vector
	 * @return distance
	 */
	distance(v1: Vector2Like): number {
		v1 = this._vectorize(v1);

		return Math.hypot((this._x**2 - v1[0]**2) + (this._y**2 - v1[1]**2))
	}

	/**
	 *
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

		this._x = this._mag * Math.sin(theta);
		this._y = this._mag * Math.sin(theta);

		return this;
	}

	/**
	 *
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
	 *
	 * Get the angle or angles between a positive axis or a vector
	 *
	 * @param a Vector or axis
	 * @param unit degree/radians
	 * @returns angle
	 */
	between(a: Vector2Like | Axis2D, unit: 'deg' | 'rad' = 'rad') {
		let theta = 0;

		// !0 => true, ![>0] => false
		if (!this._mag)
			throw new Error('This vector cannot have magnitude of zero');

		if (a == 'x' || a == 'y' || a == 'i' || a == 'j') {
			switch (a) {
				case 'x' || 'i':
					theta = Math.acos(this._x / this._mag);
					break;
				case 'y' || 'j':
					theta = Math.acos(this._y / this._mag);
					break;
			}
		} else {
			a = this._vectorize(a);

			// !0 => true, ![>0] => false
			if (!a[0] || !a[1])
				throw new Error('Vector cannot have magnitude of zero');

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
	 *
	 * Max between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec2
	 */
	max(v1: Vector2Like) {
		v1 = this._vectorize(v1);

		this._x = Math.max(this._x, v1[0]);
		this._y = Math.max(this._y, v1[1]);

		return this;
	}

	/**
	 *
	 * Min between two vectors
	 *
	 * @param v1 Vector
	 * @returns Vec2
	 */
	min(v1: Vector2Like) {
		v1 = this._vectorize(v1);

		this._x = Math.min(this._x, v1[0]);
		this._y = Math.min(this._y, v1[1]);

		return this;
	}

	/**
	 *
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
	 *
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
	 *
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
	 * 
	 * Clamp coordinates between two vectors, min and max.
	 * 
	 * @param min minimum vector
	 * @param max maximum vector
	 * @returns Vec2
	 */
	clamp(min: Vector2Like, max: Vector2Like) {
		min = this._vectorize(min);
		max = this._vectorize(max);

		// assumes min < max, componentwise

		this._x = Math.max(min[0], Math.min(max[0], this._x));
		this._y = Math.max(min[1], Math.min(max[1], this._y));

		return this;
	}

	/**
	 *
	 * Add together two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	add(v: Vector2Like) {
		v = this._vectorize(v);

		this._x += v[0];
		this._y += v[1];

		return this;
	}

	/**
	 *
	 * Subtract two vectors, vector sum is this vector.
	 *
	 * @param v Vector
	 * @returns Vec2
	 */
	sub(v: Vector2Like) {
		v = this._vectorize(v);

		this._x -= v[0];
		this._y -= v[1];

		return this;
	}

	/**
	 *
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
	 *
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
     * 
     * Extend a 2D vector into a 3D space.
     * 
     * @returns Vec3
     */
    extend(): Vec3 {
        return new Vec3(this._x, this._y, 0)
	}
	
	*[ Symbol.iterator ]() {

		yield this._x;
		yield this._y;

	}
}

export interface Vec2 {
	dimensions: number;
	length: number;
	isVector2: boolean;
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
	applyMatrix3: function(this: Vec2, m): Vec2 {

		const x = this.x, y = this.y;
		const e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

		return this;
	}
};
