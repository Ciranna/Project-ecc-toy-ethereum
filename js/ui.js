
export function displayCurve(curve, basePoint) {
    const equation = document.getElementById(
        "curve-equation"
    );

    const point = document.getElementById(
        "base-point"
    );

    equation.textContent =
        `y² = x³ + ${curve.a}x + ${curve.b} (mod ${curve.p})`;

    point.textContent =
        `Base Point G = (${basePoint.x}, ${basePoint.y})`;
}


export function getPrivateKey() {
    const input = document.getElementById("private-key");

    if (input.value.trim() === "") {
        throw new Error("Please enter a private key.");
    }

    const k = Number(input.value);

    if (!Number.isSafeInteger(k) || k < 1 || k > 8) {
        throw new Error(
            "Private key must be an integer between 1 and 8."
        );
    }

    return k;
}


export function displayResult(result) {
    const section = document.getElementById(
        "results-section"
    );

    const tbody = document.getElementById(
        "steps-body"
    );

    const publicKey = document.getElementById(
        "public-key-result"
    );

    tbody.replaceChildren();

    for (const step of result.steps) {
        const row = document.createElement("tr");

        const stepCell = document.createElement("td");
        stepCell.textContent = `${step.multiplier}G`;

        const pointCell = document.createElement("td");

        const point = step.point;

        pointCell.textContent = point === null
            ? "Point at infinity"
            : `(${point.x}, ${point.y})`;

        row.append(stepCell, pointCell);
        tbody.appendChild(row);
    }

    const Q = result.publicKey;

    publicKey.textContent = Q === null
        ? "Point at infinity"
        : `(${Q.x}, ${Q.y})`;

    section.hidden = false;
}


export function displayError(message) {
    document.getElementById(
        "error-message"
    ).textContent = message;
}


export function clearError() {
    displayError("");
}


function renderFrequency(containerId, frequencies) {
    const container = document.getElementById(containerId);
    container.replaceChildren();

    const max = Math.max(...frequencies, 1);

    frequencies.forEach((frequency, value) => {
        const row = document.createElement("div");
        row.className = "frequency-row";

        const label = document.createElement("span");
        label.textContent = value;

        const bar = document.createElement("div");
        bar.className = "frequency-bar";
        bar.style.width = `${(frequency / max) * 100}%`;

        const count = document.createElement("span");
        count.textContent = frequency;

        row.append(label, bar, count);
        container.appendChild(row);
    });
}


export function displayStatistics(stats) {
    renderFrequency("x-frequency", stats.xFrequency);
    renderFrequency("y-frequency", stats.yFrequency);

    const bitResults = document.getElementById("bit-results");

    bitResults.textContent =
        `X: ${stats.xBits.ones} ones, ${stats.xBits.zeros} zeros. ` +
        `Y: ${stats.yBits.ones} ones, ${stats.yBits.zeros} zeros.`;

    const correlations = document.getElementById(
        "correlation-results"
    );

    const formatCorrelation = value =>
        value === null ? "undefined" : value.toFixed(4);

    correlations.textContent =
        `Correlation(k, x): ${formatCorrelation(stats.correlationX)} | ` +
        `Correlation(k, y): ${formatCorrelation(stats.correlationY)}`;

    const avalanche = document.getElementById(
        "avalanche-results"
    );

    avalanche.replaceChildren();

    const table = document.createElement("table");
    const header = document.createElement("tr");

    for (const name of ["k", "Modified k", "Changed bits", "Percentage"]) {
        const th = document.createElement("th");
        th.textContent = name;
        header.appendChild(th);
    }

    table.appendChild(header);

    for (const item of stats.avalanche) {
        const row = document.createElement("tr");

        const values = [
            item.originalKey,
            item.changedKey,
            `${item.changedBits}/${item.totalBits}`,
            `${item.percentage.toFixed(1)}%`
        ];

        for (const value of values) {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        }

        table.appendChild(row);
    }

    avalanche.appendChild(table);

    document.getElementById(
        "statistics-results"
    ).hidden = false;
}

