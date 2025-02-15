export type TensorLike =
    | number[]
    | number[][]
    | number[][][]
    | number[][][][];

export class Tensor {
    private _tensor: TensorLike;
    private _shape: number[];

    constructor(t: TensorLike | number) {
        // ignore 0D tensor (scalar)
        if (typeof t == 'number') {
            this._tensor = new Array(t).fill(0);
            this._shape = [t];
        } else if (Array.isArray(t)) {
            if (Array.isArray(t[0])) {
                if (Array.isArray(t[0][0])) {
                    if (Array.isArray(t[0][0][0])) {
                        this._tensor = t as number[][][][];
                        this._shape = [
                            t.length,
                            t[0].length,
                            t[0][0].length,
                            t[0][0][0].length,
                        ];
                    } else {
                        this._tensor = t as number[][][];
                        this._shape = [t.length, t[0].length, t[0][0].length];
                    }
                } else {
                    this._tensor = t as number[][];
                    this._shape = [t.length, t[0].length];
                }
            } else {
                this._tensor = t as number[];
                this._shape = [t.length];
            }
        } else {
            throw new Error(
                'Invalid arguments provided for Tensor constructor',
            );
        }
    }

    // _apply(fn: (x: number) => number): void {
    //     // used to apply operations like +, -, *, /, etc.
    //     // to each element in the tensor
    // }

    get tensor(): TensorLike {
        return this._tensor;
    }

    set tensor(t: TensorLike) {
        this._tensor = t;
    }

    get shape(): number[] {
        return this._shape;
    }

    // tensor operations
    // ...
}
