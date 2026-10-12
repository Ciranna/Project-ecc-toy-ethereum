# ECC Toy Cryptography — Private Key to Public Key

## Overview

This project is an educational web application demonstrating elliptic-curve scalar multiplication, inspired by the public-key cryptography used in Ethereum.

The application uses a small toy elliptic curve rather than a production cryptographic curve.

## Mathematical Parameters

The toy curve is defined by:

\[
y^2 = x^3 + 7 \pmod{17}
\]

- Prime field: \(p = 17\)
- Base point: \(G = (1,5)\)
- Example private key: \(k = 6\)
- Resulting toy public key: \(Q = 6G = (5,8)\)

The base point has order 9.

## Features

- Generate a toy public key from a private key.
- Display intermediate scalar multiplication steps.
- Analyze coordinate frequencies.
- Examine binary bit distributions.
- Calculate input-output Pearson correlations.
- Explore avalanche-like behavior using Hamming distance.

## Architecture

The application uses Vanilla JavaScript with ES Modules.

- `index.html`: HTML interface
- `css/style.css`: Styling
- `js/config.js`: Curve parameters
- `js/math.js`: Modular arithmetic
- `js/ellipticCurve.js`: Elliptic-curve operations
- `js/statistics.js`: Statistical analysis
- `js/ui.js`: DOM presentation
- `js/main.js`: Application entry point
- `tests/`: Automated tests

## Running Locally

From the project root:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Running Tests

Requires Node.js.

```bash
npm test
```

## Cryptographic Considerations

This project is strictly educational and must not be used for real cryptographic operations.

Real Ethereum public-key cryptography uses the secp256k1 elliptic curve and a much larger finite field.

Elliptic-curve scalar multiplication is computationally efficient in the forward direction, while recovering the scalar from a public point is believed to be computationally infeasible for appropriately selected real-world parameters.

The statistical exploration is illustrative. The small dataset and the algebraic structure of the curve do not provide evidence of real-world cryptographic security.

## Conclusion

The project demonstrates the mathematical relationship between private keys and public keys, the role of modular arithmetic, and the distinction between elliptic-curve one-way operations and cryptographic hash functions.