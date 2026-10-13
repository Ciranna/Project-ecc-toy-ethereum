
# ECC Toy Cryptography

An interactive educational application demonstrating how elliptic-curve scalar multiplication generates a public key from a private key.

**Live Demo:** https://ciranna.github.io/Project-ecc-toy-ethereum/

## 1. Project Objective

The application illustrates the fundamental operation used in elliptic-curve public-key cryptography:

Q = kG

where:

- k is the private key.
- G is a fixed base point on the elliptic curve.
- Q is the corresponding public key.
- kG denotes elliptic-curve scalar multiplication.

The project uses a small toy curve to make the underlying arithmetic understandable and observable.

## 2. Mathematical Model

The elliptic curve is defined over the finite field F17:

y² = x³ + 7 (mod 17)

Parameters:

- Prime modulus: p = 17
- Curve coefficient: a = 0
- Curve coefficient: b = 7
- Base point: G = (1, 5)
- Order of G: 9

Example:

Private key: k = 6

Public key: Q = 6G = (5, 8)

The point at infinity is represented internally as null.

## 3. Features

- Private-key input and public-key generation
- Elliptic-curve point addition and doubling
- Modular inverse calculation
- Scalar multiplication through repeated addition
- Step-by-step interactive visualization
- Mathematical explanation of point operations
- Statistical exploration of public-point coordinates
- Bit distribution and correlation analysis
- Hamming-distance and avalanche-like analysis
- Scientific conclusions and limitations
- Automated unit tests

## 4. Project Structure

ecc-toy-ethereum/
├── index.html
├── README.md
├── package.json
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── math.js
│   ├── ellipticCurve.js
│   ├── curveExplanation.js
│   ├── statistics.js
│   ├── ui.js
│   └── main.js
└── tests/
    ├── math.test.js
    ├── ellipticCurve.test.js
    ├── curveExplanation.test.js
    └── statistics.test.js

## 5. Running Locally

Requirements:

- A modern web browser
- Python 3, or another static HTTP server
- Node.js for automated testing

Start a local server:

```bash
python3 -m http.server 8000
```

Open:

http://localhost:8000

## 6. Automated Tests

Run:

```bash
npm test
```

The test suite covers modular arithmetic, point operations, scalar multiplication, and statistical functionality.

## 7. Statistical Exploration

The application explores:

- Coordinate frequency distributions
- Bit distributions
- Linear correlations
- Hamming distances between encoded public points
- Avalanche-like changes in output representations

These experiments illustrate mathematical and statistical properties of the selected toy curve.

They do not constitute a proof of cryptographic security.

## 8. Scientific Interpretation

Elliptic-curve scalar multiplication is deterministic.

For appropriately chosen real-world cryptographic curves, computing Q = kG is efficient, while recovering k from Q is believed to be computationally infeasible using known classical algorithms.

This property is related to the Elliptic Curve Discrete Logarithm Problem (ECDLP).

Scalar multiplication is not a cryptographic hash function. In particular, avalanche-like behavior should not be confused with the security assumptions underlying ECC.

## 9. Security Limitations

This application is strictly educational.

The chosen base point has order 9, so the corresponding private-key space is extremely small.

An attacker can recover a private key by enumerating the possible multiples of G.

The implementation must not be used for real cryptographic operations, key management, authentication, or digital signatures.

Ethereum uses the real-world elliptic curve secp256k1, with much larger parameters.

## 10. Technologies

- HTML5
- CSS3
- JavaScript ES Modules
- Node.js built-in test runner
- GitHub Pages

## 11. Conclusion

The project demonstrates how a private key is transformed into a public point through elliptic-curve scalar multiplication.

The interactive visualization makes the mathematical operations observable, while the statistical exploration highlights the limitations of interpreting cryptographic properties using a very small curve.

The application is intended for learning, experimentation, and academic demonstration.
```
