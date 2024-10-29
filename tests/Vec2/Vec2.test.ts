import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Vec1, Vec2, Vec3, VecN } from '../../src/index.ts';
import { Matrix } from '../../src/math/matrix.ts';
import { assertEquals } from 'jsr:@std/assert@^1.0.6/equals';

const TOLERANCE = 0.0001;

describe('Vec2', () => {
    it('constructor', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2([1, 2]);
        const w = new Vec2({ x: 1, y: 2 });
        const x = new Vec2(Float32Array.of(1, 2));
        const y = new Vec2(Float64Array.of(1, 2));
        expect(v).toBeInstanceOf(Vec2);
        expect(u).toBeInstanceOf(Vec2);
        expect(w).toBeInstanceOf(Vec2);
        expect(x).toBeInstanceOf(Vec2);
        expect(y).toBeInstanceOf(Vec2);
        expect(v).toEqual(u);
        expect(v).toEqual(w);
        expect(v).toEqual(x);
        expect(v).toEqual(y);
    });

    it('get x', () => {
        const v = new Vec2(1, 2);
        expect(v.x).toEqual(1);
    });

    it('set x', () => {
        const v = new Vec2(1, 2);
        v.x = 3;
        expect(v.x).toEqual(3);
    });

    it('get y', () => {
        const v = new Vec2(1, 2);
        expect(v.y).toEqual(2);
    });

    it('set y', () => {
        const v = new Vec2(1, 2);
        v.y = 3;
        expect(v.y).toEqual(3);
    });

    it('get coords', () => {
        const v = new Vec2(1, 2);
		expect(v.coords).toEqual([1, 2]);
	});

    it('get magnitude', () => {
        const v = new Vec2(3, 4);

        // sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5
        expect(v.mag).toEqual(5);
    });

    it('set magnitude (number)', () => {
        const v = new Vec2(1, 2);
        v.mag = 5;
        expect(v.mag).toEqual(5);
        expect(v.x).toEqual(5); // cos(0) = 1
        expect(v.y).toBeCloseTo(0, TOLERANCE); // sin(0) = 0
    });

    it('set magnitude (object)', () => {
        const v = new Vec2(1, 2);
        v.mag = {magnitude: 5, theta: Math.PI/2};
        expect(v.mag).toEqual(5);
        expect(v.x).toBeCloseTo(0, TOLERANCE); // cos(π/2) = 0
        expect(v.y).toEqual(5); // sin(π/2) = 1
    });

    it('get angle', () => {
        const v = new Vec2(1, 1);
        expect(v.angle).toEqual(Math.PI/4); // arctan(1/1) = π/4
    });

    it('clone', () => {
        const v = new Vec2(1, 2);
        const c = v.clone();
        expect(c).toEqual(v);
    });

    it('copy', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        v.copy(u);
        expect(v).toEqual(u);
    });

    it('zero', () => {
        const v = new Vec2(1, 2);
        v.zero();
        expect(v.coords).toEqual([0, 0]);
    });

    it('unit', () => {
        const v = new Vec2(15, 15);
        v.unit();
        expect(v.coords).toEqual([Math.SQRT1_2, Math.SQRT1_2]);
    });

    it('antiparallel', () => {
        const v = new Vec2(3, 4);

        v.antiparallel();
        expect(v.coords).toEqual([-3, -4]);
    });

    it('dot product', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        expect(v.dot(u)).toEqual(11);
    });

    // for 2D we actually use wedge product.
    it('cross product', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        // computationally we use v.wedge(u) for 2D, cross is alias.
        // 1 * 4 - 2 * 3 = 4 - 6 = -2
        expect(v.cross(u)).toEqual(-2);
    });

    it('distance' , () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        // sqrt((3-1)^2 + (4-2)^2) = sqrt(2^2 + 2^2) = sqrt(4 + 4) = sqrt(8)
        expect(v.distance(u)).toBeCloseTo(Math.sqrt(8), TOLERANCE);
    });

    it('from (rad)', () => {
        const v = new Vec2(3, 4); // mag = 5

        v.from(Math.PI/4);
        expect(v.x).toBeCloseTo(5/2 * Math.SQRT2, TOLERANCE); // cos(π/4) = sin(π/4) = √2/2
        expect(v.y).toBeCloseTo(5/2 * Math.SQRT2, TOLERANCE);
    });

    it('from (deg)', () => {
        const v = new Vec2(3, 4);

        v.from(45, 'deg');
        expect(v.x).toBeCloseTo(5/2 * Math.SQRT2, TOLERANCE); // cos(45deg) = sin(45deg) = √2/2
        expect(v.y).toBeCloseTo(5/2 * Math.SQRT2, TOLERANCE);
    });

    it('rotate (implicit)', () => {
        const v = new Vec2(4, 4); // mag = 4√2

        v.rotate(); // rotate by current angle
        expect(v.x).toBeCloseTo(4, TOLERANCE); // mag * cos(π/4) = 4√2 * 1/√2 = 4
        expect(v.y).toBeCloseTo(4, TOLERANCE); // mag * sin(π/4) = 4√2 * 1/√2 = 4
        expect(v.mag).toEqual(4 * Math.SQRT2);
    });

    it('rotate (rad)', () => {
        const v = new Vec2(4, 4); // mag = 4√2

        v.rotate(Math.PI/4);
        expect(v.x).toBeCloseTo(0, TOLERANCE); // mag * cos(2π/4) = 4√2 * 0 = 0
        expect(v.y).toEqual(4 * Math.SQRT2); // mag * sin(2π/4) = 4√2 * 1 = 4√2
        expect(v.mag).toEqual(4 * Math.SQRT2);
    });

    it('rotate (deg)', () => {
        const v = new Vec2(4, 4); // mag = 4√2

        v.rotate(45, 'deg');
        expect(v.x).toBeCloseTo(0, TOLERANCE); // mag * cos(2π/4) = 4√2 * 0 = 0
        expect(v.y).toEqual(4 * Math.SQRT2); // mag * sin(2π/4) = 4√2 * 1 = 4√2
        expect(v.mag).toEqual(4 * Math.SQRT2);
    });

    it('between (axis + rad)', () => {
        const v = new Vec2(1, 1);

        // angle between v and i-hat is π/4
        expect(v.between('i')).toBeCloseTo(Math.PI/4, TOLERANCE);
    });

    it('between (axis + deg)', () => {
        const v = new Vec2(1, 1);

        // angle between v and j-hat is π/4
        expect(v.between('y', 'deg')).toBeCloseTo(45, TOLERANCE);
    });

    it('between (v + rad)', () => {
        const v = new Vec2(1, 1);
        const u = new Vec2(2, 2);

        // angle between v and u is 0
        expect(v.between(u)).toBeCloseTo(0, TOLERANCE);
    });

    it('between (v + deg)', () => {
        const v = new Vec2(1, 1);
        const u = new Vec2(-1, -1);

        // angle between v and u is 180
        expect(v.between(u, 'deg')).toBeCloseTo(180, TOLERANCE);
    });

    it('max', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);

        v.max(u);
        expect(v.coords).toEqual([3, 4]);
    });

    it('min', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);

        v.min(u);
        expect(v.coords).toEqual([1, 2]);
    });

    it('ceil', () => {
        const v = new Vec2(1.1, 2.2);
        v.ceil();
        expect(v.coords).toEqual([2, 3]);
    });

    it('floor', () => {
        const v = new Vec2(1.1, 2.2);
        v.floor();
        expect(v.coords).toEqual([1, 2]);
    });

    it('round (up)', () => {
        const v = new Vec2(1.5, 2.5);
        v.round();
        expect(v.coords).toEqual([2, 3]);
    });

    it('round (down)', () => {
        const v = new Vec2(1.4, 2.4);
        v.round();
        expect(v.coords).toEqual([1, 2]);
    });

    it('clamp', () => {
        const v = new Vec2(1, 2);
        v.clamp([2, 3], [3, 4]);
        expect(v.coords).toEqual([2, 3]);
    });

    it('segment vector', () => {
        const v = new Vec2(1, 2);
        const A: [number, number] = [3, 4];
        const B: [number, number] = [5, 6];

        v.segvec(A, B);

        // B -> A = B - A = [5-3, 6-4] = [2, 2]
        expect(v.coords).toEqual([2, 2]);
    });

    it('add', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        v.add(u);
        expect(v.coords).toEqual([4, 6]);
    });

    it('sub', () => {
        const v = new Vec2(1, 2);
        const u = new Vec2(3, 4);
        v.sub(u);
        expect(v.coords).toEqual([-2, -2]);
    });

    it('multiply', () => {
        const v = new Vec2(1, 2);
        v.multiply(2);
        expect(v.coords).toEqual([2, 4]);
    });

    it('divide', () => {
        const v = new Vec2(1, 2);
        v.divide(2);
        expect(v.coords).toEqual([0.5, 1]);
    });

    it('transform (to 1)', () => {
        const v = new Vec2(1, 2);
        // matrix to transform to 1d
        const m = new Matrix([[1, 0]]);

        const u = v.transform(m);
        expect(u).toEqual(new Vec1(1));
    });

    it('transform (to 3)', () => {
        const v = new Vec2(1, 2);
        // matrix to transform to 3d
        const m = new Matrix([[1, 0], [0, 1], [1, 1]]);

        const u = v.transform(m);
        expect(u).toEqual(new Vec3(1, 2, 3));
    });

    it('transform (to N)', () => {
        const v = new Vec2(1, 2);
        // matrix to transform to Nd
        const m = new Matrix([[1, 0], [0, 1], [3, 1], [1, 3]]);

        const u = v.transform(m);
        expect(u).toEqual(new VecN([1, 2, 5, 7]));
    });

    it('extend', () => {
        const v = new Vec2(1, 2);

        const u = v.extend();
        expect(u).toEqual(new Vec3([1, 2, 0]));
    })
});

// describe('Vec2 THREEJS', () => {
//     it('set', () => {
//         const v = new Vec2(1, 2);
//         v.three.set(3, 4);
//         expect(v.coords).toEqual([3, 4]);
//     });

//     it('setX', () => {
//         const v = new Vec2(1, 2);
//         v.three.setX(3);
//         expect(v.x).toEqual(3);
//     });

//     it('setY', () => {
//         const v = new Vec2(1, 2);
//         v.three.setY(3);
//         expect(v.y).toEqual(3);
//     });

//     it('applyMatrix3', () => {
//         const v = new Vec2(1, 2);
//         const m = [[2, 0], [0, 1/2]];

//         v.three.applyMatrix3(m);
//         expect(v.coords).toEqual([2, 1]);
//     });
// });