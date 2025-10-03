import DATA from '../main_settings.json'
import generateRandomColors from './generateRandomColors'

const generateDucks = (ducksCount = 2, colorsCount = 3) => {
	const colors = generateRandomColors(colorsCount)
	const ducks = []
	const centerX = DATA.CANVAS_WIDTH / 2
	const centerY = DATA.CANVAS_HEIGHT / 2

	colors.forEach(color => {
		for (let i = 0; i < ducksCount; i++) {
			const angle = Math.random() * Math.PI * 2
			const r = Math.random() * DATA.SPAWN_RADIUS
			ducks.push({
				id: `${color}-${i}-${Math.random()}`,
				color,
				x: centerX + Math.cos(angle) * r,
				y: centerY + Math.sin(angle) * r,
				vx: (Math.random() - 0.5) * 0.4,
				vy: (Math.random() - 0.5) * 0.4,
				radius: DATA.DUCK_RADIUS,
				maxSpeed: DATA.DUCK_MAX_SPEED,
			})
		}
	})

	return ducks
}

export default generateDucks
