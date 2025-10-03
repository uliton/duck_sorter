import { useState, useEffect, useRef } from 'react'
import DATA from './main_settings.json'
import Dog from './ui/Dog'
import Duck from './ui/Duck'
import generateDucks from './service/generateDucks'
import calculateGroupCohesion from './behavior/calculateGroupCohesion'
import calculateSimpleSeparation from './behavior/calculateSimpleSeparation'
import calculateWallAvoidance from './behavior/calculateWallAvoidance'
import calculateDogInfluence from './behavior/calculateDogInfluence'
import checkWinCondition from './logic/checkWinCondition'
import './App.scss'

function App() {
	const [ducksCount, setDucksCount] = useState(2)
	const [colorsCount, setColorsCount] = useState(3)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameCompleted, setGameCompleted] = useState(false)
	const [time, setTime] = useState(0)

	const canvasRef = useRef(null)
	const animationRef = useRef(null)
	const ducksRef = useRef([])
	const dogRef = useRef({
		x: DATA.CANVAS_WIDTH / 2,
		y: DATA.CANVAS_HEIGHT / 2,
	})
	const mousePosRef = useRef({
		x: DATA.CANVAS_WIDTH / 2,
		y: DATA.CANVAS_HEIGHT / 2,
	})

	const startGame = () => {
		ducksRef.current = generateDucks(ducksCount, colorsCount)
		dogRef.current = { x: DATA.CANVAS_WIDTH / 2, y: DATA.CANVAS_HEIGHT / 2 }
		setGameStarted(true)
		setGameCompleted(false)
		setTime(0)
	}

	// Рух миші
	useEffect(() => {
		const handleMouseMove = e => {
			if (!gameStarted || !canvasRef.current) return
			const canvas = canvasRef.current
			const rect = canvas.getBoundingClientRect()
			const scaleX = canvas.width / rect.width
			const scaleY = canvas.height / rect.height

			mousePosRef.current = {
				x: (e.clientX - rect.left) * scaleX,
				y: (e.clientY - rect.top) * scaleY,
			}
		}

		const canvas = canvasRef.current
		if (canvas) canvas.addEventListener('mousemove', handleMouseMove)
		return () => {
			if (canvas) canvas.removeEventListener('mousemove', handleMouseMove)
		}
	}, [gameStarted])

	// Ігровий цикл
	useEffect(() => {
		if (!gameStarted || gameCompleted) return // якщо гра ще не почалась або вже завершилась, то не запускаємо цикл
		const canvas = canvasRef.current // отримуємо посилання на canvas
		const ctx = canvas.getContext('2d') // отримаємо контекст для малювання 2D-графіки

		const gameLoop = () => {
			ctx.fillStyle = DATA.CANVAS_FIELD_COLOR // задаємо колір ігрового поля
			ctx.fillRect(0, 0, DATA.CANVAS_WIDTH, DATA.CANVAS_HEIGHT) // встановлюємо розмір ігрового поля

			const dog = dogRef.current // задаємо позицію собаки (центр ігрового поля)
			const mouse = mousePosRef.current // останнє положення миші на ігровому полі
			dog.x += (mouse.x - dog.x) * 0.2 // рахуємо різницю між позицією миші та собаки
			dog.y += (mouse.y - dog.y) * 0.2 // використання коеф. 0.2 додає трохи затримки руху собаки

			const ducks = ducksRef.current // отримуємо поточний масив усіх качок на ігровому полі
			const cx = ducks.reduce((s, d) => s + d.x, 0) / ducks.length // сумує координати всіх качок
			const cy = ducks.reduce((s, d) => s + d.y, 0) / ducks.length // отримуємо середнє положення центру всієї групи

			// перераховуємо кожну качку і повертаємо нові координати та швидкість
			const updated = ducks.map(duck => {
				const cohesion = calculateGroupCohesion(duck, ducks) // прагнення качки триматися біля центру маси всіх качок (правило поведінки)
				const separation = calculateSimpleSeparation(duck, ducks) // відштовхування качки від сусідів, щоб не злипатися (правило поведінки)
				const wall = calculateWallAvoidance(duck) // відштовхування від стін ігрового поля (правило поведінки)
				const dogInf = calculateDogInfluence(duck, dog) // реакція на собаку (правило поведінки)

				let vx =
					duck.vx +
					(cohesion.x * 1.2 + separation.x * 1.5 + wall.x + dogInf.x * 0.7) // корекція швидкості
				let vy =
					duck.vy +
					(cohesion.y * 1.2 + separation.y * 1.5 + wall.y + dogInf.y * 0.7) // із врахуванням кожної сили, що корегується власним коефіцієнтом

				const speed = Math.sqrt(vx * vx + vy * vy) // обрахування швидкості руху
				if (speed > duck.maxSpeed) {
					vx = (vx / speed) * duck.maxSpeed
					vy = (vy / speed) * duck.maxSpeed
				} // корегування швидкості відносно максимально встановленої

				if (Math.random() < 0.02) {
					vx += (Math.random() - 0.5) * 0.1
					vy += (Math.random() - 0.5) * 0.1
				} // додаємо трохи випадкового руху качки (2%) для імітації життя

				// записуємо проміжні координати
				let x = duck.x + vx
				let y = duck.y + vy

				// встановлюємо обмеження на віддаленість окремої качки від центру мас
				const dx = x - cx
				const dy = y - cy
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist > DATA.MAX_DISTANCE_FROM_CENTER) {
					const ratio = DATA.MAX_DISTANCE_FROM_CENTER / dist
					x = cx + dx * ratio
					y = cy + dy * ratio
				} // корегуємо якщо потрібно

				// перевіряємо щоб качка не перейшла межі ігрового поля
				x = Math.max(duck.radius, Math.min(DATA.CANVAS_WIDTH - duck.radius, x))
				y = Math.max(duck.radius, Math.min(DATA.CANVAS_HEIGHT - duck.radius, y))

				return { ...duck, x, y, vx: vx * 0.95, vy: vy * 0.95 } // повертаємо оновлені координати з усіма можливими корекціями і трохи пригальмовуємо (коеф. 0.95 - 5%)
			})

			ducksRef.current = updated // зберігаємо новий стан качок
			updated.forEach(d => Duck(ctx, d)) // перемальовуємо качок
			Dog(ctx, dog) // перемальовуємо собаку

			// перевіряємо чи виконана умова виграшу
			if (checkWinCondition(updated)) {
				setGameCompleted(true) // якщо перевірка пройдена, зупиняємо гру
				return
			}

			animationRef.current = requestAnimationFrame(gameLoop) // плануємо виклик цієї ж функції знову на наступному кадрі чим створюємо безперервний цикл анімації
		}

		animationRef.current = requestAnimationFrame(gameLoop) // запускаємо перший кадр анімації після рендера, щоб почати гру
		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current) // при демонтажі компонента або зміні стану, зупиняємо цикл, щоб уникнути зайвих викликів
		}
	}, [gameStarted, gameCompleted]) // хук спрацьовує щоразу, коли гра стартує або закінчується

	// Таймер
	useEffect(() => {
		let sec
		if (gameStarted && !gameCompleted)
			sec = setInterval(() => setTime(p => p + 1), 1000)
		return () => clearInterval(sec)
	}, [gameStarted, gameCompleted])

	return (
		<div className='game-container'>
			<h1>Duck Sorter</h1>
			<div className='control-panel'>
				<div className='duck-control'>
					<p>Кіл-ть качок кожного кольору</p>
					<div>
						<button onClick={() => setDucksCount(p => Math.max(2, p - 1))}>
							-
						</button>
						<span>{ducksCount}</span>
						<button onClick={() => setDucksCount(p => Math.min(12, p + 1))}>
							+
						</button>
					</div>
				</div>

				<div className='duck-control'>
					<p>Кіл-ть кольорів для качок</p>
					<div>
						<button onClick={() => setColorsCount(p => Math.max(3, p - 1))}>
							-
						</button>
						<span>{colorsCount}</span>
						<button onClick={() => setColorsCount(p => Math.min(8, p + 1))}>
							+
						</button>
					</div>
				</div>

				<button className='start-button' onClick={startGame}>
					{gameCompleted
						? 'Гра завершена, розпочати нову'
						: gameStarted
						? 'Перезапустити гру'
						: 'Почати гру'}
				</button>

				<div className='timer'>Час: {time} с</div>
			</div>

			<div
				className='game-area'
				style={{ width: DATA.CANVAS_WIDTH, height: DATA.CANVAS_HEIGHT }}
			>
				{!gameStarted && (
					<div className='start-screen'>
						<p>Керуйте собакою, щоб розділити качок за кольорами!</p>
						<ul>
							Зараз буде:
							<li>качок кожного кольору - {ducksCount}</li>
							<li>різних кольорів для качок - {colorsCount}</li>
							<p>Всього качок - {ducksCount * colorsCount}</p>
						</ul>
					</div>
				)}

				{gameCompleted && (
					<div className='completion-screen'>
						<h2>Вітаємо!</h2>
						<p>Ви розсортували качок за {time} секунд!</p>
					</div>
				)}

				<canvas
					ref={canvasRef}
					width={DATA.CANVAS_WIDTH}
					height={DATA.CANVAS_HEIGHT}
					className='game-canvas'
					style={{ backgroundColor: DATA.CANVAS_FIELD_COLOR }}
				/>
			</div>
		</div>
	)
}

export default App
