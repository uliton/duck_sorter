const calculateDogInfluence = (duck, dogPos) => {
	const dx = duck.x - dogPos.x
	const dy = duck.y - dogPos.y
	const distanceSq = dx * dx + dy * dy
	const influenceDistance = 120

	if (distanceSq < influenceDistance * influenceDistance) {
		const distance = Math.sqrt(distanceSq)
		const force = (influenceDistance - distance) / influenceDistance
		return {
			x: (dx / distance) * force * 0.6,
			y: (dy / distance) * force * 0.6,
		}
	}
	return { x: 0, y: 0 }
}

export default calculateDogInfluence