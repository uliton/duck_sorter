const ALL_COLORS = [
	'#FF0000',
	'#00FF00',
	'#0000FF',
	'#FFFF00',
	'#FF7F00',
	'#00FFFF',
	'#8B00FF',
	'#8B4513',
]

const generateRandomColors = count => {
	const copy = [...ALL_COLORS]
	const result = []

	const max = Math.min(count, copy.length)
	for (let i = 0; i < max; i++) {
		const randomIndex = Math.floor(Math.random() * copy.length)
		result.push(copy[randomIndex])
		copy.splice(randomIndex, 1)
	}

	return result
}

export default generateRandomColors
