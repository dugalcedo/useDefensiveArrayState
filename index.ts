import { useState } from "react"

type VOrCB<T> = (T[]) | ((current: T[])=>T[])
type SortCB<T> = (a: T, b: T) => number
type FilterCB<T> = (item: T, i: number, arr: T[]) => boolean

const useDefensiveArrayState = <T>(initial: T[]) => {
    const getInitial = () => [...initial]
    const [state, setState] = useState<T[]>([...initial])
    const getState = () => [...state]
    const [unfiltered, setUnfiltered] = useState<T[]>([...initial])
    const getUnfiltered = () => [...unfiltered]

    const revert = () => {
        setState(getInitial())
    }

    const update = (valueOrCallback: VOrCB<T>) => {
        if (typeof valueOrCallback === "function") {
            const copy = getState()
            const newState = valueOrCallback(copy)
            setState(newState)
        } else if (Array.isArray(valueOrCallback)) {
            setState([...valueOrCallback])
        } else {
            throw new Error("DefensiveArrayState can only be updated with an array or callback.")
        }
    }

    const pop = () => {
        const copy = getState()
        copy.pop()
        setState(copy)
    }

    const shift = () => {
        const copy = getState()
        copy.shift()
        setState(copy)
    }

    const push = (...args: T[]) => {
        setState([...getState(), ...args])
    }

    const unshift = (...args: T[]) => {
        setState([...args, ...getState()])
    }

    const splice = (start: number, count: number, ...args: T[]) => {
        const copy = getState()
        copy.splice(start, count, ...args)
        setState(copy)
    }

    const reverse = () => {
        const copy = getState()
        copy.reverse()
        setState(copy)
    }

    const unfilter = () => {
        setState(getUnfiltered())
    }

    const filter = (f: FilterCB<T>): T[] => {
        const filtered = getState().filter(f)
        setState(filtered)
        return filtered
    }

    const sort = (s: SortCB<T>) => {
        const unfilteredCopy = getUnfiltered()
        const copy = getState()
        copy.sort(s)
        unfilteredCopy.sort(s)
        setState(copy)
        setUnfiltered(unfilteredCopy)
    }

    const sortByKey = (k: keyof T, desc?: boolean) => {
        const copy = getState()
        copy.sort((a, b) => {
            const [valA, valB] = [a[k], b[k]]
            if (typeof valA === "string" && typeof valB === "string") {
                return desc ? valB.localeCompare(valA) : valA.localeCompare(valB)
            } else if (typeof valA === "number" && typeof valB === "number") {
                return desc ? valB - valA : valA - valB
            } else {
                return 0
            }
        })
        setState(copy)
    }

    return {
        state,
        setState: update,
        setStateClassic: setState,
        unfiltered,
        get initial() {
            return [...initial]
        },
        get stateCopy() {
            return getState()
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
    }
}

export default useDefensiveArrayState