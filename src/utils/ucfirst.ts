export default function ucfirst(str?: string) {
	if (!str) return null

	return str.charAt(0).toUpperCase() + str.slice(1)
}
