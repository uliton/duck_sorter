import DATA from '../main_settings.json'

const calculateSimpleSeparation = (duck, allDucks) => {
	let sx = 0,
		sy = 0
	allDucks.forEach(other => {
		if (other === duck) return
		const dx = duck.x - other.x
		const dy = duck.y - other.y
		const distSq = dx * dx + dy * dy
		if (
			distSq < DATA.SEPARATION_DISTANCE * DATA.SEPARATION_DISTANCE &&
			distSq > 0.1
		) {
			const dist = Math.sqrt(distSq)
			const force = (DATA.SEPARATION_DISTANCE - dist) / DATA.SEPARATION_DISTANCE
			sx += (dx / dist) * force * DATA.SEPARATION_FORCE
			sy += (dy / dist) * force * DATA.SEPARATION_FORCE
		}
	})
	return { x: sx, y: sy }
}

export default calculateSimpleSeparation
