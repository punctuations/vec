import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';

import { vec, Vec2, Vec3 } from '../../src/index.ts';
import { VecN } from '../../src/N/index.ts';
import { Matrix } from '../../src/math/matrix.ts';

function expectVecN(result: VecN | Error): VecN {
	if (result instanceof Error) {
		throw new Error(`Expected VecN, but got Error: ${result.message}`);
	}
	return result;
}

describe('Vector Addition', () => {
	it('adds 2D vectors', () => {
		expect(expectVecN(vec().add([1, 0], [0, 1])).coords).toEqual([1, 1]);
	});

	it('adds 3D vectors', () => {
		expect(expectVecN(vec().add([1, 0, 0], [0, 0, 1])).coords).toEqual([
			1,
			0,
			1,
		]);
	});

	it('adds 2D & 3D vectors', () => {
		expect(() => vec().add([1, 0, 0], [0, 1])).toThrow(RangeError);
	});
});

describe('Vector Subtraction', () => {
	it('subtract 2D vectors', () => {
		expect(expectVecN(vec().sub([1, 0], [0, 1])).coords).toEqual([1, -1]);
	});

	it('subtract 3D vectors', () => {
		expect(expectVecN(vec().sub([1, 3, 0], [0, 1, 1])).coords).toEqual([
			1,
			2,
			-1,
		]);
	});

	it('subtracts 2D & 3D vectors', () => {
		expect(() => vec().sub([1, 0, 0], [0, 1])).toThrow(RangeError);
	});
});

describe('Vector Scalar Multiplication', () => {
	it('scalar multiply 2D vectors', () => {
		expect(expectVecN(vec().multiply([1, -3], 5)).coords).toEqual([5, -15]);
	});

	it('neg. scalar multiply 2D vectors', () => {
		expect(expectVecN(vec().multiply([1, -3], -5)).coords).toEqual([
			-5,
			15,
		]);
	});

	it('scalar multiply 3D vectors', () => {
		expect(expectVecN(vec().multiply([1, -3, 4], 5)).coords).toEqual([
			5,
			-15,
			20,
		]);
	});

	it('neg. scalar multiply 3D vectors', () => {
		expect(expectVecN(vec().multiply([1, -3, 4], -5)).coords).toEqual([
			-5,
			15,
			-20,
		]);
	});
});

describe('Vector Scalar Division', () => {
	it('scalar div 2D vectors', () => {
		expect(expectVecN(vec().divide([1, -3], 5)).coords).toEqual([
			1 / 5,
			-3 / 5,
		]);
	});

	it('neg. scalar div 2D vectors', () => {
		expect(expectVecN(vec().divide([1, -3], -5)).coords).toEqual([
			-1 / 5,
			3 / 5,
		]);
	});

	it('scalar div 3D vectors', () => {
		expect(expectVecN(vec().divide([1, -3, 4], 5)).coords).toEqual([
			1 / 5,
			-3 / 5,
			4 / 5,
		]);
	});

	it('neg. scalar div 3D vectors', () => {
		expect(expectVecN(vec().divide([1, -3, 4], -5)).coords).toEqual([
			-1 / 5,
			3 / 5,
			-4 / 5,
		]);
	});
});

describe('From Array', () => {
	it('from array to vec', () => {
		const vecArray = vec().fromArray([1, 2, 3, 4, 5, 6], 3);

		expect(vecArray).toEqual([new Vec3(1, 2, 3), new Vec3(4, 5, 6)])
	});
})

describe('Vector Spans', () => {
	it('Span of v3 = [1, 1, 1]', () => {
		let v3 = new Vec3([1, 1, 1]);

		expect(vec().span(v3)).toEqual({ basis: [new VecN([1, 1, 1])], dimension: 1});
	});

	it('Span of v2 = [1, 1]', () => {
		let v2 = new Vec2([1, 1]);

		expect(vec().span(v2)).toEqual({ basis: [new VecN([1, 1])], dimension: 1 });
	});

	it('Span of matrix', () => {
		let m = new Matrix([[1, 0], [0, 1]]);

		const span = vec().span(m);

		expect(span).toEqual({ basis: [new Vec2([1, 0]), new Vec2([0, 1])], dimension: 2})
	});
});

describe('Vector collinearity', () => {
	it('collinear to span of v3', () => {
		let span = vec().span([1, 1, 1]);

		expect(vec().collinear(span, [2, 2, 2])).toBeTruthy();
	});

	it('noncollinear to span of v3', () => {
		let span = vec().span([1, 1, 1]);

		expect(vec().collinear(span, [3, 2, 5])).toBeFalsy();
	});

	it('collinear to span of v2', () => {
		let span = vec().span([1, 1]);

		expect(vec().collinear(span, [2, 2])).toBeTruthy();
	});

	it('noncollinear to span of v3', () => {
		let span = vec().span([1, 1]);

		expect(vec().collinear(span, [3, 5])).toBeFalsy();
	});

	it('collinear to vector', () => {
		let v1 = new Vec3([1, 5, 4]);
		let v2 = new Vec3([15, 75, 60]);

		expect(vec().collinear(v1, v2)).toBeTruthy();
	});

	it('collinear to vector-like', () => {
		expect(vec().collinear([200, 200], [2, 2])).toBeTruthy();
	});
});
