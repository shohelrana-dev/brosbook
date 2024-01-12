export default function ucfirst(word?: string) {
	if (!word) return null

	const firstLetter = word.charAt(0)

	const firstLetterCap = firstLetter.toUpperCase()

	const remainingLetters = word.slice(1)

	return firstLetterCap + remainingLetters
}
