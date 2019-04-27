class Pattern {
  constructor(size) {
    // prettier-ignore
    this.spots = Array(size).fill(0).map(() => [0, 0]);
    // prettier-ignore
    this.speeds = Array(size).fill(0).map(() => [0, 0]);
    this.running = false
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
    const d = (Date.now() - this.t) / 1000
    this.t = Date.now()

    this.render(d)

    if (this.running) {
      window.requestAnimationFrame(this.preRender.bind(this))
    }
  }

  render(d) {
    this.renderReset()
    this.moveAll(d)

    ctx.fillStyle = 'white'
    for (let spot of this.spots) {
      ctx.fillRect(...spot, 5, 5)
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
