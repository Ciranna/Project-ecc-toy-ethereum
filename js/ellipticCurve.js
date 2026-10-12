
import { CURVE } from "./config.js";
import { mod, modInverse } from "./math.js";

export function pointAdd(P, Q) {
    const { p, a } = CURVE;

    // Identity element
    if (P === null) return Q;
    if (Q === null) return P;

    // Opposite points: P + (-P) = O
    if (
        P.x === Q.x &&
        mod(P.y + Q.y, p) === 0
    ) {
        return null;
    }

    let lambda;

    if (P.x === Q.x && P.y === Q.y) {
        // Point doubling
        const numerator = 3 * P.x ** 2 + a;
        const denominator = 2 * P.y;

        lambda = mod(
            numerator * modInverse(denominator, p),
            p
        );
    } else {
        // Addition of distinct points
        const numerator = Q.y - P.y;
        const denominator = Q.x - P.x;

        lambda = mod(
            numerator * modInverse(denominator, p),
            p
        );
    }

    const x3 = mod(lambda ** 2 - P.x - Q.x, p);
    const y3 = mod(lambda * (P.x - x3) - P.y, p);

    return { x: x3, y: y3 };
}


export function scalarMultiply(k, G) {
    if (!Number.isSafeInteger(k) || k < 0) {
        throw new Error("Invalid private key");
    }

    let result = null;
    const steps = [];

    for (let i = 1; i <= k; i++) {
        result = pointAdd(result, G);

        steps.push({
            multiplier: i,
            point: result
        });
    }

    return {
        publicKey: result,
        steps: steps
    };
}
