import { vec, Vec2, Vec3 } from '../../src';
import { VecN } from '../../src/N';

function expectVecN(result: VecN | Error): VecN {
    if (result instanceof Error) {
      throw new Error(`Expected VecN, but got Error: ${result.message}`);
    }
    return result;
  }

describe('Vector Addition', () => {
    test('adds 2D vectors', () => {
        expect(expectVecN(vec().add([1, 0], [0, 1])).coords).toEqual([1, 1]);
    });
    
    test('adds 3D vectors', () => {
        expect(expectVecN(vec().add([1, 0, 0], [0, 0, 1])).coords).toEqual([1, 0, 1]);
    });
    
    test('adds 2D & 3D vectors', () => {
        expect(() => vec().add([1, 0, 0], [0, 1])).toThrow(RangeError);
    });
});

describe('Vector Subtraction', () => {
    test('subtract 2D vectors', () => {
        expect(expectVecN(vec().sub([1, 0], [0, 1])).coords).toEqual([1, -1]);
    });
    
    test('subtract 3D vectors', () => {
        expect(expectVecN(vec().sub([1, 3, 0], [0, 1, 1])).coords).toEqual([1, 2, -1]);
    });
    
    test('subtracts 2D & 3D vectors', () => {
        expect(() => vec().sub([1, 0, 0], [0, 1])).toThrow(RangeError);
    });
});

describe('Vector Scalar Multiplication', () => {
    test('scalar multiply 2D vectors', () => {
        expect(expectVecN(vec().multiply([1, -3], 5)).coords).toEqual([5, -15]);
    });

    test('neg. scalar multiply 2D vectors', () => {
        expect(expectVecN(vec().multiply([1, -3], -5)).coords).toEqual([-5, 15]);
    });
    
    test('scalar multiply 3D vectors', () => {
        expect(expectVecN(vec().multiply([1, -3, 4], 5)).coords).toEqual([5, -15, 20]);
    });

    test('neg. scalar multiply 3D vectors', () => {
        expect(expectVecN(vec().multiply([1, -3, 4], -5)).coords).toEqual([-5, 15, -20]);
    });
});

describe('Vector Scalar Division', () => {
    test('scalar div 2D vectors', () => {
        expect(expectVecN(vec().divide([1, -3], 5)).coords).toEqual([1/5, -3/5]);
    });

    test('neg. scalar div 2D vectors', () => {
        expect(expectVecN(vec().divide([1, -3], -5)).coords).toEqual([-1/5, 3/5]);
    });
    
    test('scalar div 3D vectors', () => {
        expect(expectVecN(vec().divide([1, -3, 4], 5)).coords).toEqual([1/5, -3/5, 4/5]);
    });

    test('neg. scalar div 3D vectors', () => {
        expect(expectVecN(vec().divide([1, -3, 4], -5)).coords).toEqual([-1/5, 3/5, -4/5]);
    });
});

describe('Vector Spans', () => {
    test('Span of v3 = [1, 1, 1]', () => {
        let v3 = new Vec3([1, 1, 1]);

        expect(vec().span(v3).coords).toEqual([1, 1, 1])
    })

    test('Span of v2 = [1, 1]', () => {
        let v2 = new Vec2([1, 1]);

        expect(vec().span(v2).coords).toEqual([1, 1])
    })

    test('Span of matrix', () => {
        // TODO

        expect(true).toEqual(true);
    })
})
 
describe('Vector colinearity', () => {
    test('colinear to span of v3', () => {
        let span = vec().span([1, 1, 1])

        expect(vec().colinear(span, [2, 2, 2])).toBeTruthy()
    })
    
    test('noncolinear to span of v3', () => {
        let span = vec().span([1, 1, 1])
        
        expect(vec().colinear(span, [3, 2, 5])).toBeFalsy()
    })

    test('colinear to span of v2', () => {
        let span = vec().span([1, 1])

        expect(vec().colinear(span, [2, 2])).toBeTruthy()
    })
    
    test('noncolinear to span of v3', () => {
        let span = vec().span([1, 1])
        
        expect(vec().colinear(span, [3, 5])).toBeFalsy()
    })

    test('colinear to vector', () => {
        let v1 = new Vec3([1, 5, 4]);
        let v2 = new Vec3([15, 75, 60]);

        expect(vec().colinear(v1, v2)).toBeTruthy()
    })

    test('colinear to vector-like', () => {
        expect(vec().colinear([200, 200], [2, 2])).toBeTruthy()
    })
})
