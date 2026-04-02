import { useEffect, useMemo, useRef, useState } from 'react'

const BASE_DURATION = 4200
const REDUCED_DURATION = 2400
const FADE_DURATION = 520

const createDustParticle = (radiusMax) => ({
  angle: Math.random() * Math.PI * 2,
  radius: Math.random() * radiusMax * 0.9 + radiusMax * 0.1,
  speed: Math.random() * 0.9 + 0.25,
  shrink: Math.random() * 0.45 + 0.15,
  size: Math.random() * 1.8 + 0.4,
  alpha: Math.random() * 0.5 + 0.2,
})

function IntroParticles({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let frameId
    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      drift: Math.random() * 0.35 + 0.05,
      twinkle: Math.random() * 0.6 + 0.2,
    }))

    const dustCount = 70
    const dust = Array.from({ length: dustCount }, () => createDustParticle(140))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = (time) => {
      frameId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, width, height)

      const t = time * 0.001
      const centerX = width * 0.5
      const centerY = height * 0.56

      ctx.globalCompositeOperation = 'source-over'
      stars.forEach((star) => {
        const twinkle = 0.6 + Math.sin(t * 2 + star.twinkle * 8) * 0.4
        const x = star.x * width
        const y = star.y * height

        star.y += star.drift * 0.0005
        if (star.y > 1) star.y = 0

        ctx.fillStyle = `rgba(255, 227, 168, ${star.alpha * twinkle})`
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = 'lighter'
      dust.forEach((particle) => {
        particle.angle += particle.speed * 0.01
        particle.radius -= particle.shrink * 0.2

        if (particle.radius < 16) {
          Object.assign(particle, createDustParticle(160))
        }

        const x = centerX + Math.cos(particle.angle) * particle.radius
        const y = centerY + Math.sin(particle.angle) * particle.radius * 0.35
        const fade = Math.min(1, particle.radius / 120)
        const opacity = particle.alpha * fade

        ctx.fillStyle = `rgba(255, 214, 140, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    resize()
    frameId = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [active])

  return <canvas ref={canvasRef} className="intro-particles" aria-hidden="true" />
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isReduced, setIsReduced] = useState(() => {
    if (typeof window === 'undefined') return true
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const reducedMotion = motionQuery?.matches ?? false
    const cores = navigator.hardwareConcurrency ?? 4
    const memory = navigator.deviceMemory ?? 4
    return reducedMotion || cores <= 4 || memory <= 4
  })
  const finishedRef = useRef(false)

  const duration = useMemo(() => (isReduced ? REDUCED_DURATION : BASE_DURATION), [isReduced])

  useEffect(() => {
    const getReduced = () => {
      if (typeof window === 'undefined') return true
      const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      const reducedMotion = motionQuery?.matches ?? false
      const cores = navigator.hardwareConcurrency ?? 4
      const memory = navigator.deviceMemory ?? 4
      return reducedMotion || cores <= 4 || memory <= 4
    }

    const updateReduced = () => setIsReduced(getReduced())
    updateReduced()

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    motionQuery?.addEventListener?.('change', updateReduced)

    return () => motionQuery?.removeEventListener?.('change', updateReduced)
  }, [])

  useEffect(() => {
    const start = performance.now()
    const interval = setInterval(() => {
      const ratio = Math.min(1, (performance.now() - start) / duration)
      setProgress(Math.round(ratio * 100))
    }, 80)

    return () => clearInterval(interval)
  }, [duration])

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      onComplete?.()
    }

    const exitTimer = setTimeout(() => setIsExiting(true), Math.max(0, duration - FADE_DURATION))
    const finishTimer = setTimeout(finish, duration)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(finishTimer)
    }
  }, [duration, onComplete])

  const handleSkip = () => {
    if (finishedRef.current) return
    setProgress(100)
    setIsExiting(true)
    window.setTimeout(() => {
      if (finishedRef.current) return
      finishedRef.current = true
      onComplete?.()
    }, FADE_DURATION)
  }

  return (
    <div
      className={`loader${isExiting ? ' is-exiting' : ''}${isReduced ? ' loader--reduced' : ''}`}
      role="status"
      aria-live="polite"
    >
      <IntroParticles active={!isReduced} />
      <div className="intro-ambient" aria-hidden="true" />
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-dust" aria-hidden="true" />
      <div className="intro-center">
        <div className="intro-logo-wrap">
          <span className="intro-logo-halo" aria-hidden="true" />
          <img
            src="/ever.png"
            alt="Evervale Realty logo"
            className="intro-logo"
            loading="eager"
            decoding="async"
          />
        </div>
        <h1 className="intro-title">EVERVALE</h1>
        <div className="intro-subline">
          <span className="intro-rule" aria-hidden="true" />
          <span className="intro-subtitle">REALTY</span>
          <span className="intro-rule" aria-hidden="true" />
        </div>
        <p className="intro-tagline">Property. Powered.</p>
        <div className="intro-progress" aria-hidden="true">
          <div className="intro-progress-track">
            <span
              className="intro-progress-bar"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <span className="intro-progress-text">{progress}%</span>
        </div>
      </div>
      <button type="button" className="intro-skip" onClick={handleSkip}>
        Skip Intro
      </button>
    </div>
  )
}
