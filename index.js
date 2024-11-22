"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDefensiveArrayState = (initial) => {
    const getInitial = () => [...initial];
    const [state, setState] = (0, react_1.useState)([...initial]);
    const getState = () => [...state];
    const [unfiltered, setUnfiltered] = (0, react_1.useState)([...initial]);
    const getUnfiltered = () => [...unfiltered];
    const revert = () => {
        setState(getInitial());
    };
    const update = (valueOrCallback) => {
        if (typeof valueOrCallback === "function") {
            const copy = getState();
            const newState = valueOrCallback(copy);
            setState(newState);
        }
        else if (Array.isArray(valueOrCallback)) {
            setState([...valueOrCallback]);
        }
        else {
            throw new Error("DefensiveArrayState can only be updated with an array or callback.");
        }
    };
    const pop = () => {
        const copy = getState();
        copy.pop();
        setState(copy);
    };
    const shift = () => {
        const copy = getState();
        copy.shift();
        setState(copy);
    };
    const push = (...args) => {
        setState([...getState(), ...args]);
    };
    const unshift = (...args) => {
        setState([...args, ...getState()]);
    };
    const splice = (start, count, ...args) => {
        const copy = getState();
        copy.splice(start, count, ...args);
        setState(copy);
    };
    const reverse = () => {
        const copy = getState();
        copy.reverse();
        setState(copy);
    };
    const unfilter = () => {
        setState(getUnfiltered());
    };
    const filter = (f) => {
        const filtered = getState().filter(f);
        setState(filtered);
        return filtered;
    };
    const sort = (s) => {
        const unfilteredCopy = getUnfiltered();
        const copy = getState();
        copy.sort(s);
        unfilteredCopy.sort(s);
        setState(copy);
        setUnfiltered(unfilteredCopy);
    };
    const sortByKey = (k, desc) => {
        const copy = getState();
        copy.sort((a, b) => {
            const [valA, valB] = [a[k], b[k]];
            if (typeof valA === "string" && typeof valB === "string") {
                return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }
            else if (typeof valA === "number" && typeof valB === "number") {
                return desc ? valB - valA : valA - valB;
            }
            else {
                return 0;
            }
        });
    };
    return {
        state,
        setState: update,
        setStateClassic: setState,
        unfiltered,
        get initial() {
            return [...initial];
        },
        get stateCopy() {
            return getState();
        },
        revert,
        pop,
        shift,
        push,
        unshift,
        splice,
        reverse,
        unfilter,
        filter,
        sort,
        sortByKey
    };
};
exports.default = useDefensiveArrayState;
