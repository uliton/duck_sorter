const Duck = (ctx, duck) => {
	ctx.save()
	ctx.translate(duck.x, duck.y)
	ctx.fillStyle = duck.color || '#00d8ff'
	ctx.beginPath()
	ctx.arc(0, 0, duck.radius, 0, Math.PI * 2)
	ctx.fill()
	ctx.restore()
}

export default Duck