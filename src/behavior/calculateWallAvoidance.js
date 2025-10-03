import DATA from '../main_settings.json'

const calculateWallAvoidance = duck => {
	const margin = 30
	let avoidance = { x: 0, y: 0 }

	if (duck.x < margin) avoidance.x += ((margin - duck.x) / margin) * 0.3
	if (duck.x > DATA.CANVAS_WIDTH - margin)
		avoidance.x -= ((duck.x - (DATA.CANVAS_WIDTH - margin)) / margin) * 0.3
	if (duck.y < margin) avoidance.y += ((margin - duck.y) / margin) * 0.3
	if (duck.y > DATA.CANVAS_HEIGHT - margin)
		avoidance.y -= ((duck.y - (DATA.CANVAS_HEIGHT - margin)) / margin) * 0.3

	return avoidance
}

export default calculateWallAvoidance
