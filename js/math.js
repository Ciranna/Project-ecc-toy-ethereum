
export function mod(n, p) {
    return ((n % p) + p) % p;
}

export function modInverse(n, p) {
    n = mod(n, p);

    for (let i = 1; i < p; i++) {
        if (mod(n * i, p) === 1) {
            return i;
        }
    }

    throw new Error(
        `No modular inverse for ${n} modulo ${p}`
    );
}
