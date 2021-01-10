import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function Home() {
  const [start_money, set_start_money] = useState(1000)
  const [years, set_years] = useState(5)
  const [spins, set_spins] = useState(1)
  const [currency, set_currency] = useState('kr')
  const [monthly, set_monthly] = useState(500)
  const [result, set_result] = useState(0)
  const [raw_result, set_raw_result] = useState(0)
  const [casino_result, set_casino_result] = useState(0)
  const [raw_casino_result, set_raw_casino_result] = useState(0)

  const withCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const calculate = () => {
    let previous_year = (parseInt(start_money) + (parseInt(monthly) * 12)) * (years > 0 ? 1.1 : 1)
    for (let i = 1; i < parseInt(years); i++) {
      console.log(i)
      previous_year = (previous_year + (parseInt(monthly) * 12)) * 1.1
    }
    set_raw_result(previous_year)
    set_result(withCommas(Math.round(previous_year)))

    let casino_previous_year = (parseInt(start_money) + (parseInt(monthly) * 12)) * (spins > 0 ? 0.96 : 1)
    for (let i = 1; i < parseInt(years); i++) {
      casino_previous_year = (casino_previous_year + (parseInt(monthly) * 12)) * (spins > 0 ? Math.pow(0.96, spins == 100 ? 99999999999 : spins) : 1)
    }
    set_raw_casino_result(casino_previous_year)
    set_casino_result(withCommas(Math.round(casino_previous_year)))
  }

  useEffect(() => {
    console.log('updating')
    calculate()
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>SpinToLose - Gambling vs Stockmarket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 600}}>
        <h1>Gambling vs Stockmarket</h1>
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flex: 2, flexDirection: 'column'}}>
            <span>Starting money</span>
            <input style={{marginRight: 10, border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_start_money(parseInt(e.target.value) || 0)} value={start_money}/>
          </div>

          <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <span>Currency</span>
            <input style={{border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_currency(e.target.value)} value={currency}/>
          </div>
        </div>

        <span>Spending / investing per month</span>
        <input style={{border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_monthly(parseInt(e.target.value) || 0)} value={monthly}/>

        <br />
        
        <span>{years == 0 ? 'years' : years == 1 ? '1 year' : `${years} years`}</span>
        <input onChange={e => set_years(e.target.value)} type="range" min="0" max="50" value={years}/>

        <span>{spins >= 100 ? '"Until broke"' : spins} {spins == 1 ? 'spin' : 'spins'} per year on the casino</span>
        <input onChange={e => set_spins(e.target.value)} type="range" min="0" max="100" value={spins}/>
        <br />
        <span>Stocks <span style={{fontSize: 12, color: '#999'}}>+10%. based on average S&P 500 returns per year from 1926-2018</span></span>
        <span style={{fontSize: 20, fontWeight: 'bold'}}>{result}{currency}</span>
        <span style={{fontSize: 12, color: '#999'}}>After {years} years on the stockmarket you would on average have accumulated {result}{currency}. {withCommas(Math.round(raw_result - (start_money + ((monthly * 12) * years))))}{currency} in pure "winnings"</span>
        <br />
        <span>Casino <span style={{fontSize: 12, color: '#999'}}>-4%. Based on average RTP 0.96 (return to player)</span></span>
        <span style={{fontSize: 20, fontWeight: 'bold'}}>{casino_result}{currency}</span>
        <span style={{fontSize: 12, color: '#999'}}>This is on average what you have left after {spins * years} spins on the casino. <span style={{color: '#000', borderBottom: '1px solid'}}>You lost {withCommas(Math.round((start_money + ((monthly * 12) * years)) - raw_casino_result))}{currency}</span></span>
      </div>
    </div>
  )
}


200 * 1.08 ^ 5