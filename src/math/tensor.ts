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

    _apply(fn: (x: number, y?: number) => number, t?: TensorLike): void {
        // used to apply operations like +, -, *, /, etc.
        // to each element in the tensor

        // iterate over each element in the tensor and apply fn
        // to each element

        if (t) {
            const applyFn = (a: any, b: any): any => {
                if (Array.isArray(a) && Array.isArray(b)) {
                    return a.map((val, idx) => applyFn(val, b[idx]));
                } else {
                    return fn(a, b);
                }
            };

            this._tensor = applyFn(this._tensor, t);
        } else {
            // just applying something to all elements of tensor.
            const applyFn = (a: any): any => {
                if (Array.isArray(a)) {
                    return a.map((val) => applyFn(val));
                } else {
                    return fn(a);
                }
            };

            this._tensor = applyFn(this._tensor);
        }
    }

    get tensor(): TensorLike {
        return this._tensor;
    }

    set tensor(t: TensorLike) {
        this._tensor = t;
        // TODO(@punctuations): update shape here
    }

    get shape(): number[] {
        return this._shape;
    }

    // tensor operations

    /**
     * Add two tensors
     *
     * @param t tensor to add
     * @returns Tensor
     */
    add(t: Tensor): Tensor {
        // add two tensors
        if (this.shape.toString() !== t.shape.toString()) {
            throw new Error('Tensors must have the same shape');
        }

        this._apply((e1: number, e2?: number) => e1 + e2!, t.tensor);

        return this;
    }

    /**
     * Subtract two tensors
     *
     * @param t tensor to subtract
     * @returns Tensor
     */
    subtract(t: Tensor): Tensor {
        // subtract two tensors
        if (this.shape.toString() !== t.shape.toString()) {
            throw new Error('Tensors must have the same shape');
        }

        this._apply((e1: number, e2?: number) => e1 - e2!, t.tensor);

        return this;
    }

    /**
     * alias for {@link Tensor.subtract}
     *
     * @param t tensor to subtract
     * @returns Tensor
     */
    sub(t: Tensor): Tensor {
        return this.subtract(t);
    }

    /**
     * Multiply two tensors
     *
     * @param t tensor to multiply
     * @returns Tensor
     */
    multiply(t: Tensor): Tensor {
        // multiply two tensors -- tensor product
        // see: https://en.wikipedia.org/wiki/Tensor_product
        if (this.shape.toString() !== t.shape.toString()) {
            throw new Error('Tensors must have the same shape');
        }

        // TODO(@punctuations): implement tensor multiplication
        // ...

        return this;
    }

    /**
     * Divide two tensors
     *
     * @param t tensor to divide
     * @returns Tensor
     */
    divide(t: Tensor): Tensor {
        // divide two tensors
        if (this.shape.toString() !== t.shape.toString()) {
            throw new Error('Tensors must have the same shape');
        }

        // TODO(@punctuations): implement tensor division
        // ...

        return this;
    }

    zero() {
        this._apply((_e: number) => 0);

        return this;
    }

    /**
     * Apply scalar (λ) to matrix.
     *
     * @param lambda scalar number
     */
    scale(lambda: number) {
        this._apply((e: number) => lambda * e);

        return this;
    }
}
