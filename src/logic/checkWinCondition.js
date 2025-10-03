import DATA from '../main_settings.json'

const checkWinCondition = ducks => {
	const colors = [...new Set(ducks.map(d => d.color))]

	for (const color of colors) {
		const group = ducks.filter(d => d.color === color)
		if (group.length <= 1) continue

		let maxDist = 0
		for (let i = 0; i < group.length; i++) {
			for (let j = i + 1; j < group.length; j++) {
				const dx = group[i].x - group[j].x
				const dy = group[i].y - group[j].y
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist > maxDist) maxDist = dist
			}
		}

		let minOtherDist = Infinity
		for (const duck of group) {
			for (const other of ducks) {
				if (other.color === color) continue
				const dx = duck.x - other.x
				const dy = duck.y - other.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist < minOtherDist) minOtherDist = dist
			}
		}

		if (maxDist * DATA.DIAMETER_COEFF > minOtherDist) return false
	}
	return true
}

export default checkWinCondition;