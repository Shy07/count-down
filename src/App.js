import React, { useEffect, useState } from 'react'
import df from 'date-fns'
import numeral from 'numeral'

import './sass/style.scss'

const futureToNow = fDate => {
  const result = []
  const now = new Date()
  const parts = ['day', 'hour', 'minute', 'second', 'millisecond']

  parts.forEach((p, i) => {
    const uP = p.charAt(0).toUpperCase() + p.slice(1)
    const t = df[`differenceIn${uP}s`](fDate, now)
    result.push(t)
    if (i < parts.length) { fDate = df[`sub${uP}s`](fDate, t) }
  })

  return result
}

const App = () => {
  const [day, setDay] = useState(0)
  const [hour, setHour] = useState(0)
  const [min, setMinute] = useState(0)
  const [second, setSecond] = useState(0)
  const [ms, setMS] = useState(0)
  const [available, setAvailable] = useState(false)
  const [stage, setStage] = useState(0)
  const [meteor, setMeteor] = useState(true)

  const endAt = df.parse('2019-10-19 22:19:00') // df.addSeconds(new Date(), 12)

  useEffect(() => {
    const handler = setInterval(() => {
      const [d, h, m, s, ms] = futureToNow(endAt)
      setDay(d)
      setHour(h)
      setMinute(m)
      setSecond(s)
      setMS(numeral(Math.floor(ms / 1000 * 100)).format('00'))

      if (d + h + m === 0 && s <= 11) setStage(1)
      if (d + h + m === 0 && s <= 10) setStage(2)
      if (d + h + m === 0 && s <= 0) {
        setStage(3)
        setAvailable(true)
      }

      if (df.isAfter(new Date(), endAt)) {
        clearInterval(handler)
        setDay(0)
        setHour(0)
        setMinute(0)
        setSecond(0)
        setMS(0)
      }
    }, 10)
    return () => clearInterval(handler)
  }, [])

  useEffect(() => {
    if (second % 20 === 0) {
      const visible = Math.random() * 100 > 60
      setMeteor(visible)
      if (visible) setTimeout(() => setMeteor(false), 15000)
    }
  }, [second])

  const handleClick = () => {
    if (available) window.location.href = 'https://teserax.com'
  }

  return (
    <div className='App'>
      {stage < 2 ? (
        <div className='lines'>
          {meteor ? (
            <>
              <div className='line' />
              <div className='line' />
              <div className='line' />
            </>
          ) : null}
        </div>
      ) : null}
      <header className='App-header'>
        {stage < 3 ? (
          stage > 1 ? (
            <p style={{ marginBottom: '1vh' }} className={`transition-1s ${stage > 0 ? '' : 'opacity-0'}`}>
              <i className='bigger'>{ second }</i>
            </p>
          ) : (
            <p style={{ marginBottom: '1vh' }} className={`transition-1s ${stage > 0 ? 'opacity-0' : ''}`}>
              <small>Coming soon</small><br />
              <span><i>{ day }</i> : <i>{ hour }</i> : <i>{ min }</i> : </span>
              <i>{ second }</i>
              <span> : <i>{ ms }</i></span>
              <br />
              <small className='tiny'>Something in the air...</small><br />
            </p>
          )
        ) : null}
        <button className={`${stage === 3 ? '' : 'opacity-0'} ${available ? 'available' : ''}`} onClick={handleClick}>
          OPEN THE DOOR TO A NEW WORLD
        </button>
      </header>
    </div>
  )
}

export default App
