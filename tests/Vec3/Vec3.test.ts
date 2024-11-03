import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Vec1, Vec2, Vec3, VecN } from '../../src/index.ts';
import { Matrix } from '../../src/math/matrix.ts';

const TOLERANCE = 0.0001;

describe('Vec3', () => {
    it('constructor', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3([1, 2, 3]);
        const w = new Vec3({ x: 1, y: 2, z: 3 });
        const r = new Vec3({ i: 1, j: 2, k: 3 });
        const x = new Vec3(Float32Array.of(1, 2, 3));
        const y = new Vec3(Float64Array.of(1, 2, 3));
        expect(v).toBeInstanceOf(Vec3);
        expect(u).toBeInstanceOf(Vec3);
        expect(w).toBeInstanceOf(Vec3);
        expect(r).toBeInstanceOf(Vec3);
        expect(x).toBeInstanceOf(Vec3);
        expect(y).toBeInstanceOf(Vec3);
        expect(v).toEqual(u);
        expect(v).toEqual(w);
        expect(v).toEqual(r);
        expect(v).toEqual(x);
        expect(v).toEqual(y);
    });

    it('get x', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.x).toEqual(1);
    });
    
    it('set x', () => {
        const v = new Vec3(1, 2, 3);
        v.x = 4;
        expect(v.x).toEqual(4);
    });

    it('get y', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.y).toEqual(2);
    });

    it('set y', () => {
        const v = new Vec3(1, 2, 3);
        v.y = 4;
        expect(v.y).toEqual(4);
    });

    it('get z', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.z).toEqual(3);
    });

    it('set z', () => {
        const v = new Vec3(1, 2, 3);
        v.z = 4;
        expect(v.z).toEqual(4);
    });

    it('get coords', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it('get cylindrical', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.cylinder).toEqual([Math.sqrt(5), Math.atan2(2, 1), 3]);
    });

    it('get spherical', () => {
        const v = new Vec3(1, 2, 3);

        const s = v.sphere;
        expect(s[0]).toBeCloseTo(Math.sqrt(14), TOLERANCE);
        expect(s[1]).toBeCloseTo(Math.acos(3 / Math.sqrt(14)), TOLERANCE);
        expect(s[2]).toBeCloseTo(Math.atan2(2, 1), TOLERANCE);
    });

    it('get magnitude', () => {
        const v = new Vec3(1, 2, 3);
        expect(v.mag).toBeCloseTo(Math.sqrt(14), TOLERANCE);
    });

    it('set magnitude', () => {
        const v = new Vec3(1, 2, 3);
        v.mag = 5;
        expect(v.mag).toEqual(5);
        expect(v.x).toEqual(0);
        expect(v.y).toEqual(0);
        expect(v.z).toEqual(5);
    });

    it('clone', () => {
        const v = new Vec3(1, 2, 3);
        const c = v.clone();
        expect(c).toEqual(v);
    });

    it('copy', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        v.copy(u.coords);
        expect(v).toEqual(u);
    });

    it('zero', () => {
        const v = new Vec3(1, 2, 3);
        v.zero();
        expect(v.coords).toEqual([0, 0, 0]);
    });

    it('unit', () => {
        const v = new Vec3(1, 2, 3);
        v.unit();
        expect(v.mag).toEqual(1);
    });

    it('antiparallel', () => {
        const v = new Vec3(1, 2, 3);
        v.antiparallel();
        expect(v.coords).toEqual([-1, -2, -3]);
    });

    it('dot product', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        expect(v.dot(u)).toEqual(32);
    });

    it('cross product', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        expect(v.cross(u)).toEqual(new Vec3(-3, 6, -3));
    });

    it('outer product', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);

        const m = v.outer(u);
        expect(m).toEqual(new Matrix([[4, 5, 6], [8, 10, 12], [12, 15, 18]]));
    });

    it('distance', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        expect(v.distance(u)).toEqual(Math.sqrt(27));
    });

    it('from (rad)', () => {
        const v = new Vec3(1, 2, 2); // mag = 3
        v.from(Math.PI/4, Math.PI/4);

        expect(v.x).toBeCloseTo(3/2, TOLERANCE);
        expect(v.y).toBeCloseTo(3/2, TOLERANCE);
        expect(v.z).toBeCloseTo(3/2 * Math.SQRT2, TOLERANCE);
    });

    it('from (deg)', () => {
        const v = new Vec3(2, 3, 6); // mag = 7
        v.from(45, 45, 'deg');

        expect(v.x).toBeCloseTo(7/2, TOLERANCE);
        expect(v.y).toBeCloseTo(7/2, TOLERANCE);
        expect(v.z).toBeCloseTo(7/2 * Math.SQRT2, TOLERANCE);
    });

    it('rotate (implicit)', () => {
        const v = new Vec3(Math.sqrt(3), 1, 2); // mag = 2√2

        v.rotate(); // rotate by [theta: atan2(1, √3) -> 2 * π/6, phi: acos(2 / 2√2) -> 2 * π/4]
        expect(v.mag).toBeCloseTo(2 * Math.SQRT2, TOLERANCE);
        expect(v.x).toBeCloseTo(Math.sqrt(2), TOLERANCE); // 2√2 * sin(2π/4) * cos(2π/6) = √3
        expect(v.y).toBeCloseTo(Math.sqrt(6), TOLERANCE); // 2√2 * sin(2π/4) * sin(2π/6) = √6
        expect(v.z).toBeCloseTo(0, TOLERANCE); // 2√2 * cos(2π/4) = 0
    });

    it('rotate (rad)', () => {
        const v = new Vec3(Math.sqrt(12), 2, 4); // mag = 4√2

        v.rotate(Math.PI/4, Math.PI/4); // rotate by [theta: π/4 + π/6, phi: π/4 + π/4]
        expect(v.x).toBeCloseTo(2 * (Math.sqrt(3) - 1), TOLERANCE);
        expect(v.y).toBeCloseTo(2 * (1 + Math.sqrt(3)), TOLERANCE);
        expect(v.z).toBeCloseTo(0, TOLERANCE);
    });

    it('rotate (deg)', () => {
        const v = new Vec3(Math.sqrt(12), 2, 4); // mag = 4√2

        v.rotate(45, 45, 'deg'); // rotate by [45 + 30, 45 + 45]
        expect(v.x).toBeCloseTo(2 * (Math.sqrt(3) - 1), TOLERANCE);
        expect(v.y).toBeCloseTo(2 * (1 + Math.sqrt(3)), TOLERANCE);
        expect(v.z).toBeCloseTo(0, TOLERANCE);
    });

    it('between (axis + rad)', () => {
        const v = new Vec3(0, 1, 0);
        expect(v.between('i')).toEqual(Math.PI/2);
    });

    it('between (vec + rad)', () => {
        const v = new Vec3(1, 1, 0);
        const u = new Vec3(-2, -2, 0);
        expect(v.between(u)).toBeCloseTo(Math.PI, TOLERANCE);
    });

    it('between (axis + deg)', () => {
        const v = new Vec3(0, 0, 2);
        expect(v.between('y', 'deg')).toEqual(90);
    });

    it('between (vec + deg)', () => {
        const v = new Vec3(-1, 1, 0);
        const u = new Vec3(1, 1, 0);
        expect(v.between(u, 'deg')).toBeCloseTo(90, TOLERANCE);
    });

    it('segment vector', () => {
        const v = new Vec3(1, 2, 3);
        const A: [number, number, number] = [1, 1, 1];
        const B: [number, number, number] = [2, 2, 2];

        const AB = v.segvec(A, B);
        expect(AB.x).toEqual(1);
        expect(AB.y).toEqual(1);
        expect(AB.z).toEqual(1);
    });

    it('max', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);

        v.max(u);
        expect(v.coords).toEqual([4, 5, 6]);
    });

    it('min', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);

        v.min(u);
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it('ceil', () => {
        const v = new Vec3(1.1, 2.2, 3.3);
        v.ceil();
        expect(v.coords).toEqual([2, 3, 4]);
    });

    it('floor', () => {
        const v = new Vec3(1.1, 2.2, 3.3);
        v.floor();
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it('round (up)', () => {
        const v = new Vec3(1.5, 2.5, 3.5);
        v.round();
        expect(v.coords).toEqual([2, 3, 4]);
    });

    it('round (down)', () => {
        const v = new Vec3(1.4, 2.4, 3.4);
        v.round();
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it('clamp', () => {
        const v = new Vec3(1, 2, 3);
        v.clamp([2, 2, 2], [3, 3, 3]);
        expect(v.coords).toEqual([2, 2, 3]);
    });

    it('add', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        v.add(u);
        expect(v.coords).toEqual([5, 7, 9]);
    });

    it('subtract', () => {
        const v = new Vec3(1, 2, 3);
        const u = new Vec3(4, 5, 6);
        v.sub(u);
        expect(v.coords).toEqual([-3, -3, -3]);
    });

    it('multiply', () => {
        const v = new Vec3(1, 2, 3);
        v.multiply(2);
        expect(v.coords).toEqual([2, 4, 6]);
    });

    it('divide', () => {
        const v = new Vec3(2, 4, 6);
        v.divide(2);
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it('transform (to 1)', () => {
        const v = new Vec3(1, 2, 3);
        const m = new Matrix([[1, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec1(1));
    });

    it('transform (to 2)', () => {
        const v = new Vec3(1, 2, 3);
        const m = new Matrix([[1, 0, 0], [0, 1, 0]]);
        expect(v.transform(m)).toEqual(new Vec2(1, 2));
    });

    it('transform (to 3)', () => {
        const v = new Vec3(1, 2, 3);
        const m = new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 2]]);
        expect(v.transform(m)).toEqual(new Vec3(1, 2, 6));
    });

    it('transform (to N)', () => {
        const v = new Vec3(1, 2, 3);
        const m = new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 2], [0, 0, 0]]);
        expect(v.transform(m)).toEqual(new VecN([1, 2, 6, 0]));
    });

    it('flatten', () => {
        const v = new Vec3(2, 2, 3);

        const u = v.flatten();
        expect(u).toBeInstanceOf(Vec2);
        expect(u.x).toBeCloseTo(2 * Math.SQRT2, TOLERANCE);
        expect(u.y).toBeCloseTo(2 * Math.SQRT2, TOLERANCE);
        expect(u.mag).toBeCloseTo(4, TOLERANCE);
    });
});
