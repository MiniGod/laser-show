class Pattern {
  constructor(size) {
    this.size = size
    // prettier-ignore
    this.spots = Array(size).fill(0).map(() => [0, 0]);
    // prettier-ignore
    this.speeds = Array(size).fill(0).map(() => [0, 0]);
    // prettier-ignore
    this.colors = 'white';

    // good bright colors - can be used in patterns
    this.goodColors = ['red', 'yellow', 'green', 'pink']

    this.running = false
  }

  giveRandomColors() {
    this.colors = Array(this.size)
      .fill(0)
      .map(() => this.goodColors[random(this.goodColors.length)])
  }

  start() {
    this.running = true
    this.t = Date.now()
    this.preRender()
  }

  stop() {
    this.running = false
  }

  moveAll(d) {
    const w = canvas.width
    const h = canvas.height
    const spots = this.spots
    const speeds = this.speeds

    for (let i in spots) {
      spots[i][0] += speeds[i][0] * d
      spots[i][1] += speeds[i][1] * d

      // prettier-ignore
      {
      if (spots[i][0] > w) { speeds[i][0] *= -1; spots[i][0] = w - (spots[i][0] - w) }
      if (spots[i][1] > h) { speeds[i][1] *= -1; spots[i][1] = h - (spots[i][1] - h) }
      if (spots[i][0] < 0) { speeds[i][0] *= -1; spots[i][0] *= -1 }
      if (spots[i][1] < 0) { speeds[i][1] *= -1; spots[i][1] *= -1 }
      }
    }
  }

  renderReset() {
    ctx.save()
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  preRender() {
    if (!this.running) return
    const d = (Date.now() - this.t) / 1000
    this.t = Date.now()

    this.render(d)

    window.requestAnimationFrame(this.preRender.bind(this))
  }

  render(d) {
    this.renderReset()
    this.moveAll(d)

    const isColorsArray = Array.isArray(this.colors)
    if (!isColorsArray) {
      ctx.fillStyle = this.colors
    }
    for (let i in this.spots) {
      if (isColorsArray) {
        ctx.fillStyle = this.colors[i]
      }

      ctx.fillRect(...this.spots[i], 5, 5)
    }
  }
}

class RandomPattern extends Pattern {
  constructor(size = 100) {
    super(size)

    for (let i = 0; i < size; i++) {
      this.spots[i] = [randomX(), randomY()]

      const speed = random(500, 1000)
      const direction = Math.random() * Math.PI * 2
      this.speeds[i] = [
        speed * Math.sin(direction),
        speed * Math.cos(direction),
      ]
    }
  }
}

class ScanningPattern extends Pattern {
  constructor(size = 30) {
    super(size)

    this.giveRandomColors()

    for (let i = 0; i < size; i++) {
      this.spots[i] = [randomX(), 0]
      this.speeds[i] = [
        random(canvas.width, canvas.width / 2) * randomFlip(),
        canvas.height / 2,
      ]
    }
  }
}

class ExplosionPattern extends Pattern {
  constructor(size = 100) {
    super(size)

    this.giveRandomColors()

    const x = (canvas.width / 2) | 0
    const y = (canvas.height / 2) | 0
    const speed = Math.min(x, y) / 0.5 // extend to the closes edge of the screen in 0.5s

    for (let i = 0; i < size; i++) {
      this.spots[i] = [x, y]

      const direction = Math.PI * 2 * (i / size)
      this.speeds[i] = [
        speed * Math.sin(direction),
        speed * Math.cos(direction),
      ]
    }
  }
}
