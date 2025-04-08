/**
 * This file, `statistics.ts`, is designed to house all statistic-related utility
 * functions utilized across the application.
 *
 * Current exported functions:
 * - `calculateDescriptiveStatistics`: Computes mean, median, mode, standard deviation, quartiles, and range for a numeric dataset.
 *
 *
 * Current exported types:
 * - `Quartiles`: Represents the quartiles (Q1, Q2, Q3) of a dataset.
 * - `DescriptiveStatistics`: Represents a collection of descriptive statistical metrics, including mean, median, mode, standard deviation, quartiles, and range.
 */

/**
 * Calculates descriptive statistics for a provided array of numbers.
 *
 * @param {number[]} numbers - An array of numbers for which descriptive statistics are to be computed.
 * @returns {DescriptiveStatistics | null} An object containing mean, median, mode, standard deviation, quartiles, and range,
 * or null if the input array is empty.
 *
 * The returned object includes:
 * - `mean`: The average of the numbers.
 * - `median`: The central value separating the higher half and the lower half of the sorted dataset.
 * - `mode`: An array of the most frequently occurring numbers.
 * - `stdev`: The standard deviation, representing the dispersion of the numbers relative to the mean.
 * - `quartiles`: An object containing:
 *    - `Q1`: First quartile (25th percentile).
 *    - `Q2`: Second quartile (median, 50th percentile).
 *    - `Q3`: Third quartile (75th percentile).
 * - `range`: The difference between the largest and smallest number in the array.
 *
 * If the input array is empty, the function returns null.
 */
export const calculateDescriptiveStatistics = (
    numbers: number[]
): DescriptiveStatistics | null => {
    if (!numbers.length) {
        return null // Return null if the array is empty
    }

    // Sort numbers for easier median and quartile calculations
    const sorted = [...numbers].sort((a, b) => a - b)

    // Calculate mean
    const mean = sorted.reduce((sum, num) => sum + num, 0) / sorted.length

    // Calculate median (middle value)
    const median =
        sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]

    // Calculate mode
    const frequencyMap = sorted.reduce(
        (freq, num) => {
            freq[num] = (freq[num] || 0) + 1
            return freq
        },
        {} as Record<number, number>
    )

    const maxFrequency = Math.max(...Object.values(frequencyMap))
    const mode = Object.keys(frequencyMap)
        .filter((key) => frequencyMap[Number(key)] === maxFrequency)
        .map(Number)

    // Calculate standard deviation
    const variance =
        sorted.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) /
        sorted.length
    const stdev = Math.sqrt(variance)

    // Calculate quartiles
    const quartile = (percentile: number): number => {
        const pos = (sorted.length - 1) * percentile
        const base = Math.floor(pos)
        const rest = pos - base

        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base])
        }
        return sorted[base]
    }

    const quartiles: Quartiles = {
        Q1: quartile(0.25),
        Q2: median,
        Q3: quartile(0.75),
    }

    // Calculate range
    const range = Math.max(...sorted) - Math.min(...sorted)

    return {
        mean,
        median,
        mode,
        stdev,
        quartiles,
        range,
    }
}

/**
 * Represents the quartiles of a data set, which divide the data into four equal parts.
 */
export type Quartiles = {
    Q1: number // The first quartile (25th percentile).
    Q2: number // Median (50th percentile)
    Q3: number // The third quartile (75th percentile).
}

/**
 * Represents a collection of descriptive statistical metrics calculated from a dataset.
 */
export type DescriptiveStatistics = {
    mean: number // The arithmetic mean of the dataset
    median: number // The middle value of the dataset when ordered, or the average of the two middle values if the dataset size is even.
    mode: number[] // The most frequently occurring value(s) in the dataset. Can include multiple values if there is a tie.
    stdev: number // The standard deviation of the dataset, a measure of the amount of variation or dispersion.
    quartiles: Quartiles // The quartiles object containing Q1 (lower quartile), Q2 (median), and Q3 (upper quartile).
    range: number // The difference between the maximum and minimum values in the dataset.
}
