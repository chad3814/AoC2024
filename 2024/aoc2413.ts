import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /^((?<prize>Prize)|(Button (?<button>[AB]))): X.(?<x>\d+), Y.(?<y>\d+)$/u
type Machine = {
    a: [number, number];
    b: [number, number];
    prize: [number, number];
};

function getMultiples(target: number, value: number): number[] {
    const num = Math.floor(target / value);
    const ret = [];
    for (let i = 0; i <= num; i++) {
        ret.push(i*value);
    }
    return ret;
}

function combos(a: number[], b: number[], target: number): [number, number][] {
    const ret: [number, number][] = [];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] + b[j] === target) {
                // console.log('a:', a[i], '-', i, 'b:', b[j], '-', j, 'target:', target, a[i] + b[j]);
                ret.push([i, j]);
            }
        }
    }
    return ret;
}

function offsetCombos(a: number[], b: number[], aBase: number, bBase: number, target: number): [number, number][] {
    const ret: [number, number][] = [];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] + b[j] + aBase + bBase === target) {
                // console.log('a:', a[i], '-', i, 'b:', b[j], '-', j, 'target:', target, a[i] + b[j]);
                ret.push([i, j]);
            }
        }
    }
    return ret;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const machines: Machine[] = [];
    let a: [number, number] = [-1, -1];
    let b: [number, number] = [-1, -1];
    for (const line of input) {
        if (line === '') continue;
        const match = line.match(RE);
        if (!match || !match.groups) {
            throw new Error('bad RE');
        }
        if (match.groups.button) {
            if (match.groups.button === 'A') {
                a = [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)];
            } else {
                b = [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)];
            }
        }
        if (match.groups.prize) {
            machines.push({
                a,
                b,
                prize: [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)],
            });
        }
    }
    if (part === 1) {
        let cost = 0;
        for (const machine of machines) {
            const aXMults = getMultiples(machine.prize[0], machine.a[0]);
            const bXMults = getMultiples(machine.prize[0], machine.b[0]);
            // console.log('aXs:', aXMults, 'bXs:', bXMults);
            const xCombos = combos(aXMults, bXMults, machine.prize[0]).filter(
                ([a, b]) => machine.a[1] * a + machine.b[1] * b  === machine.prize[1]
            );
            // console.log('combos:', xCombos);
            if (xCombos.length === 0) {
                console.log('no combo for', machine);
                continue;
            }

            const costs = xCombos.map(
                ([a, b]) => a * 3 + b
            );

            const min = Math.min(...costs);
            console.log(min, 'for machine', machine);
            cost += min;
        }
        return cost;
    }
    let cost = 0;
    for (const machine of machines) {
        const aMult = Math.ceil(10000000000000 / machine.a[0]);
        const aBase = aMult * machine.a[0];
        const aOffset = aBase - 10000000000000;
        const aMults = getMultiples(machine.prize[0] - aOffset, machine.a[0]);
        const bMult = Math.ceil(10000000000000 / machine.b[0]);
        const bBase = bMult * machine.b[0];
        const bOffset = bBase - 10000000000000;
        const bMults = getMultiples(machine.prize[0] - bOffset, machine.b[0]);
        const xCombos = offsetCombos(
            aMults, bMults,
            aBase, bBase,
            machine.prize[0] + 10000000000000)
        .filter(
            ([a, b]) => machine.a[1] * (aMult + a) + machine.b[1] * (bMult + b) === machine.prize[1]
        );
        if (xCombos.length === 0) {
            continue;
        }

        const costs = xCombos.map(
            ([a, b]) => (a + aMult) * 3 + b + bMult
        );

        const min = Math.min(...costs);
        console.log(min, 'for machine', machine);
        cost += min;
    }
    return cost;
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve, {skipTests: true});
