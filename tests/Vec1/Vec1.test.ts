import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { Vec1, Vec2, Vec3, VecN } from '../../src/index.ts';
import { Matrix } from '../../src/math/matrix.ts';

describe('Vec1', () => {
    it('constructor', () => {
        const v = new Vec1(1);
        const u = new Vec1([1]);
        const x = new Vec1(Float32Array.of(1));
        const y = new Vec1(Float64Array.of(1));

        expect(v).toBeInstanceOf(Vec1);
        expect(u).toBeInstanceOf(Vec1);
        expect(x).toBeInstanceOf(Vec1);
        expect(y).toBeInstanceOf(Vec1);
        expect(v).toEqual(u);
        expect(v).toEqual(x);
        expect(v).toEqual(y);
    });

    it('get coords', () => {
        const v = new Vec1(1);
		expect(v.coord).toEqual(1);
	});

    it('set coords', () => {
        const v = new Vec1(1);
        v.coord = 2;
        expect(v.coord).toEqual(2);
    });

    it('clone', () => {
        const v = new Vec1(1);
        const c = v.clone();
        expect(c).toEqual(v);
    });

    it('copy', () => {
        const v = new Vec1(1);
        const u = new Vec1(2);
        v.copy(u.coord);
        expect(v).toEqual(u);
    });

    it('zero', () => {
        const v = new Vec1(1);
        v.zero();
        expect(v.coord).toEqual(0);
    });

    it('unit', () => {
        const v = new Vec1(0);
        v.unit();
        expect(v.coord).toEqual(1);
    });

    it('antiparallel', () => {
        const v = new Vec1(3);

        v.antiparallel();
        expect(v.coord).toEqual(-3);
    });

    it('max', () => {
        const v = new Vec1(1);
        const u = new Vec1(2);

        v.max(u.coord);
        expect(v.coord).toEqual(2);
    });

    it('min', () => {
        const v = new Vec1(1);
        const u = new Vec1(2);

        v.min(u.coord);
        expect(v.coord).toEqual(1);
    });

    it('ceil', () => {
        const v = new Vec1(1.02);

        v.ceil()
        expect(v.coord).toEqual(2);
    });

    it('floor', () => {
        const v = new Vec1(1.02);

        v.floor()
        expect(v.coord).toEqual(1);
    });

    it('round (up)', () => {
        const v = new Vec1(1.5);

        v.round()
        expect(v.coord).toEqual(2);
    });

    it('round (down)', () => {
        const v = new Vec1(1.4);

        v.round()
        expect(v.coord).toEqual(1);
    });

    it('clamp', () => {
        const v = new Vec1(1);

        v.clamp(2, 3)
        expect(v.coord).toEqual(2);
    });

    it('add', () => {
        const v = new Vec1(1);
        const u = new Vec1(2);

        v.add(u.coord);
        expect(v.coord).toEqual(3);
    });

    it('sub', () => {
        const v = new Vec1(1);
        const u = new Vec1(2);

        v.sub(u.coord);
        expect(v.coord).toEqual(-1);
    });

    it('multiply', () => {
        const v = new Vec1(2);

        v.multiply(2);
        expect(v.coord).toEqual(4);
    });

    it('divide', () => {
        const v = new Vec1(2);

        v.divide(2);
        expect(v.coord).toEqual(1);
    });

    it('transform (to 1)', () => {
        const v = new Vec1(1);
        const m = new Matrix([[2]]);

        const u = v.transform(m);
        expect(u).toEqual(new Vec1(2));
    });

    it('transform (to 2)', () => {
        const v = new Vec1(1);
        const m = [[2], [2]];

        const u = v.transform(m);
        expect(u).toEqual(new Vec2(2, 2));
    });

    it('transform (to 3)', () => {
        const v = new Vec1(1);
        const m = [[2], [2], [2]];

        const u = v.transform(m);
        expect(u).toEqual(new Vec3(2, 2, 2));
    });

    it('transform (to N)', () => {
        const v = new Vec1(1);
        const m = [[2], [2], [2], [2]];

        const u = v.transform(m);
        expect(u).toEqual(new VecN([2, 2, 2, 2]));
    });

    it('extend', () => {
        const v = new Vec1(1);

        const u = v.extend();
        expect(u).toEqual(new Vec2(1, 0));
    });
});