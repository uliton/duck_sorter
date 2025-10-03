import DATA from '../main_settings.json'

const calculateGroupCohesion = (duck, allDucks) => {
	const cx = allDucks.reduce((s, d) => s + d.x, 0) / allDucks.length
	const cy = allDucks.reduce((s, d) => s + d.y, 0) / allDucks.length
	const dx = cx - duck.x
	const dy = cy - duck.y
	const dist = Math.sqrt(dx * dx + dy * dy) || 1

	return {
		x: (dx / dist) * DATA.COHESION_FORCE,
		y: (dy / dist) * DATA.COHESION_FORCE,
	}
}

export default calculateGroupCohesion
