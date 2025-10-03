const Dog = (ctx, dog) => {
	ctx.save()
	ctx.fillStyle = 'white'
	ctx.beginPath()
	ctx.arc(dog.x, dog.y, 8, 0, Math.PI * 2)
	ctx.fill()
	ctx.strokeStyle = 'grey'
	ctx.lineWidth = 1
	ctx.stroke()
	ctx.restore()
}

export default Dog;