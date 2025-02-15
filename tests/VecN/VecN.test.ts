import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Vec1, Vec2, Vec3, VecN } from '../../src/mod.ts';
import { Matrix } from '../../src/math/matrix.ts';
import { assertIsError } from 'jsr:@std/assert@^1.0.6/is-error';

const TOLERANCE = 0.0001;

describe('VecN', () => {
    it('constructor', () => {
        const x = new VecN(4);
        const y = new VecN(7);
        const v4 = new VecN([1, 2, 3, 4]);
        const v7 = new VecN([1, 2, 3, 4, 5, 6, 7])
        const u4 = new VecN(Float32Array.of(1, 2, 3, 4));
        const u7 = new VecN(Float64Array.of(1, 2, 3, 4, 5, 6, 7));
        expect(v4).toBeInstanceOf(VecN);
        expect(v7).toBeInstanceOf(VecN);
        expect(u4).toBeInstanceOf(VecN);
        expect(u7).toBeInstanceOf(VecN);
        expect(x).toBeInstanceOf(VecN);
        expect(y).toBeInstanceOf(VecN);
        expect(v4).toEqual(u4);
        expect(v7).toEqual(u7);
        expect(x).toEqual(new VecN([0, 0, 0, 0]));
        expect(y).toEqual(new VecN([0, 0, 0, 0, 0, 0, 0]));
    });

    it('get coords (len 4)', () => {
        const v = new VecN([1, 2, 3, 4])
        expect(v.coords).toEqual([1, 2, 3, 4]);
    });

    it('get coords (len 7)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7])
        expect(v.coords).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('set coords (len 4)', () => {
        const v = new VecN([0, 0, 0, 0]);

        v.coords = [1, 2, 3, 4];
        expect(v.coords).toEqual([1, 2, 3, 4]);
    });

    it('set coords (len 7)', () => {
        const v = new VecN([0, 0, 0, 0, 0, 0, 0]);

        v.coords = [1, 2, 3, 4, 5, 6, 7];
        expect(v.coords).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('get magnitude (len 4)', () => {
        const v = new VecN([1, 2, 3, 4]);

        expect(v.mag).toEqual(Math.sqrt(30));
    });

    it('get magnitude (len 7)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);

        expect(v.mag).toEqual(2 * Math.sqrt(35));
    });

    it('clone', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = v.clone();

        expect(v).toEqual(u);
    });

    it('copy', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([1, 2, 3, 4, 5, 6, 7]);

        v.copy(u);
        expect(v).toEqual(u);
    });

    it('zero (len 4)', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.zero();
        expect(v.coords).toEqual([0, 0, 0, 0]);
    });

    it('zero (len 7)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);

        v.zero();
        expect(v.coords).toEqual([0, 0, 0, 0, 0, 0, 0]);
    });

    it('unit (len 4)', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.unit();
        expect(v.coords).toEqual([1 / Math.sqrt(30), 2 / Math.sqrt(30), 3 / Math.sqrt(30), 4 / Math.sqrt(30)])
    });

    it('unit (len 7)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);

        v.unit();
        expect(v.coords).toEqual([1 / (2 * Math.sqrt(35)), 1 / Math.sqrt(35), 3 / (2 * Math.sqrt(35)), 2 / Math.sqrt(35), 5 / (2 * Math.sqrt(35)), 3 / Math.sqrt(35), 7 / (2 * Math.sqrt(35))])
    });

    it('antiparallel', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.antiparallel();
        expect(v.coords).toEqual([-1, -2, -3, -4]);
    });

    it('dot product', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([4, 3, 2, 1]);

        expect(v.dot(u)).toEqual(20);
    });

    it('dot product (incompat. dim.)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([1, 2, 3, 4, 5, 6, 7]);

        expect(() => v.dot(u)).toThrow();
    });

    it('distance', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([4, 3, 2, 1]);

        expect(v.distance(u)).toEqual(2 * Math.sqrt(5));
    });

    it('max', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([4, 3, 2, 1]);

        v.max(u);
        expect(v.coords).toEqual([4, 3, 3, 4]);
    });

    it('min', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([4, 3, 2, 1]);

        v.min(u);
        expect(v.coords).toEqual([1, 2, 2, 1]);
    });

    it('ceil', () => {
        const v = new VecN([1.1, 2.2, 3.3, 4.4]);

        v.ceil();
        expect(v.coords).toEqual([2, 3, 4, 5]);
    });

    it('floor', () => {
        const v = new VecN([1.5, 2.6, 3.7, 4.8]);

        v.floor();
        expect(v.coords).toEqual([1, 2, 3, 4]);
    });

    it('round', () => {
        const v = new VecN([1.5, 2.4, 3.2, 4.8]);

        v.round();
        expect(v.coords).toEqual([2, 2, 3, 5]);
    });

    it('clamp', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.clamp([2, 2, 2, 2], [3, 3, 3, 3]);
        expect(v.coords).toEqual([2, 2, 3, 3]);
    });

    it('segment vector', () => {
        const v = new VecN(4);
        const A = [1, 1, 1, 1];
        const B = [2, 2, 2, 2];

        const AB = v.segvec(A, B);
        expect(AB.coords).toEqual([1, 1, 1, 1]);
    });

    it('add', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([5, 6, 7, 8]);

        v.add(u);
        expect(v.coords).toEqual([6, 8, 10, 12]);
    });

    it('sub', () => {
        const v = new VecN([1, 2, 3, 4]);
        const u = new VecN([4, 3, 2, 1]);

        v.sub(u);
        expect(v.coords).toEqual([-3, -1, 1, 3]);
    });

    it('multiply', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.multiply(3);
        expect(v.coords).toEqual([3, 6, 9, 12]);
    });

    it('divide', () => {
        const v = new VecN([1, 2, 3, 4]);

        v.divide(2);
        expect(v.coords).toEqual([1/2, 1, 3/2, 2]);
    });

    it('transform (4 -> 1)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const m = new Matrix([[1, 0, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec1(1));
    });

    it('transform (4 -> 2)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const m = new Matrix([[1, 0, 0, 0], [0, 1, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec2(1, 2));
    });

    it('transform (4 -> 3)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const m = new Matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]]);
        expect(v.transform(m)).toEqual(new Vec3(1, 2, 3));
    });

    it('transform (4 -> 4)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const m = new Matrix([[2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 2, 0], [0, 0, 0, 2]]);
        expect(v.transform(m)).toEqual(new VecN([2, 4, 6, 8]));
    });

    it('transform (4 -> 7)', () => {
        const v = new VecN([1, 2, 3, 4]);
        const m = new Matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1]]);
        expect(v.transform(m)).toEqual(new VecN([1, 2, 3, 4, 5, 6, 7]));
    });

    it('transform (7 -> 1)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);
        const m = new Matrix([[1, 0, 0, 0, 0, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec1(1));
    });

    it('transform (7 -> 2)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);
        const m = new Matrix([[1, 0, 0, 0, 0, 0, 0],
                            [0, 1, 0, 0, 0, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec2(1, 2));
    });

    it('transform (7 -> 3)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);
        const m = new Matrix([[1, 0, 0, 0, 0, 0, 0],
                            [0, 1, 0, 0, 0, 0, 0],
                            [0, 0, 1, 0, 0, 0, 0]]);
        expect(v.transform(m)).toEqual(new Vec3(1, 2, 3));
    });

    it('transform (7 -> 4)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);
        const m = new Matrix([[1, 0, 0, 0, 0, 0, 0],
                            [0, 1, 0, 0, 0, 0, 0],
                            [0, 0, 1, 0, 0, 0, 0],
                            [0, 0, 0, 1, 0, 0, 0]]);
        expect(v.transform(m)).toEqual(new VecN([1, 2, 3, 4]));
    });

    it('transform (7 -> 7)', () => {
        const v = new VecN([1, 2, 3, 4, 5, 6, 7]);
        const m = new Matrix([[2, 0, 0, 0, 0, 0, 0],
                            [0, 2, 0, 0, 0, 0, 0],
                            [0, 0, 2, 0, 0, 0, 0],
                            [0, 0, 0, 2, 0, 0, 0],
                            [0, 0, 0, 0, 2, 0, 0],
                            [0, 0, 0, 0, 0, 2, 0],
                            [0, 0, 0, 0, 0, 0, 2]]);
        expect(v.transform(m)).toEqual(new VecN([2, 4, 6, 8, 10, 12, 14]));
    });
});