
import { CURVE } from "./config.js";
import { mod, modInverse } from "./math.js";

export function explainPointAddition(P, Q) {
    const { p, a } = CURVE;

    // Identity element
    if (P === null || Q === null) {
        return {
            type: "identity",
            result: P === null ? Q : P,
            description:
                "Adding the point at infinity leaves the other point unchanged."
        };
    }

    // Opposite points
    if (P.x === Q.x && mod(P.y + Q.y, p) === 0) {
        return {
            type: "infinity",
            result: null,
            description:
                "The points are inverses. Their sum is the point at infinity."
        };
    }

    const doubling = P.x === Q.x && P.y === Q.y;

    let numerator;
    let denominator;

    if (doubling) {
        numerator = 3 * P.x ** 2 + a;
        denominator = 2 * P.y;
    } else {
        numerator = Q.y - P.y;
        denominator = Q.x - P.x;
    }

    const normalizedDenominator = mod(denominator, p);
    const inverse = modInverse(normalizedDenominator, p);

    const lambda = mod(numerator * inverse, p);

    const rawX = lambda ** 2 - P.x - Q.x;
    const x3 = mod(rawX, p);

    const rawY = lambda * (P.x - x3) - P.y;
    const y3 = mod(rawY, p);

    return {
        type: doubling ? "doubling" : "addition",

        P,
        Q,

        numerator,
        denominator,
        normalizedDenominator,
        inverse,
        lambda,

        rawX,
        rawY,

        result: { x: x3, y: y3 }
    };
}
