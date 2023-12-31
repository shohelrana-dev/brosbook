/**
 * Calculates the outer height of an element, including its margins, borders, and padding.
 *
 * @param {Element} element - The element whose outer height should be calculated.
 * @returns {number} The outer height of the element in pixels.
 */
export default function getElOuterHeight(element: Element) {
    // Array of CSS properties that contribute to outer height:
    const heightContributors = [
        'margin-top',
        'margin-bottom',
        'border-top',
        'border-bottom',
        'padding-top',
        'padding-bottom',
        'height',
    ]

    // Get the computed styles for the element:
    const computedStyle = window.getComputedStyle(element)

    // Calculate the total outer height by summing the values of the relevant CSS properties:
    return heightContributors
        .map(property => parseInt(computedStyle.getPropertyValue(property), 10))
        .reduce((total, value) => total + value, 0) // Start with an initial total of 0
}
