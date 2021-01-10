import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function Home() {
  const [start_money, set_start_money] = useState(1000)
  const [years, set_years] = useState(1)
  const [spins, set_spins] = useState(10)
  const [currency, set_currency] = useState('kr')
  const [monthly, set_monthly] = useState(0)
  const [result, set_result] = useState(0)
  const [raw_result, set_raw_result] = useState(0)
  const [casino_result, set_casino_result] = useState(0)
  const [raw_casino_result, set_raw_casino_result] = useState(0)

  const withCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const calculate = () => {
    let previous_year = (parseInt(start_money) + (parseInt(monthly) * 12)) * (years > 0 ? 1.1 : 1)
    for (let i = 1; i < parseInt(years); i++) {
      previous_year = (previous_year + (parseInt(monthly) * 12)) * 1.1
    }
    set_raw_result(previous_year)
    set_result(withCommas(Math.round(previous_year)))

    let casino_previous_year = (parseInt(start_money) + (parseInt(monthly) * 12)) * (spins > 0 ? Math.pow(0.96, spins == 100 ? 99999999999 : spins) : 1)
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
      <div style={{display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 490, padding: 20}}>
        <h1>Gambling vs Stockmarket</h1>
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flex: 2, flexDirection: 'column'}}>
            <span>Starting money</span>
            <input style={{width: 'calc(100% - 10px)', border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_start_money(parseInt(e.target.value) || 0)} value={start_money}/>
          </div>

          <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
            <span>Currency</span>
            <input style={{width: '100%', border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_currency(e.target.value)} value={currency}/>
          </div>
        </div>

        <span>Spending / investing per month</span>
        <input style={{width: '100%', border: '2px solid #0075ff', borderRadius: 3, padding: 10}} onChange={e => set_monthly(parseInt(e.target.value) || 0)} value={monthly}/>

        <br />
        
        <span>{years == 0 ? '0 years' : years == 1 ? '1 year' : `${years} years`}</span>
        <input onChange={e => set_years(e.target.value)} type="range" min="1" max="50" value={years}/>

        <span>{spins >= 100 ? '"Until broke"' : spins} {spins == 1 ? 'spin' : 'spins'} per year on the casino</span>
        <input onChange={e => set_spins(e.target.value)} type="range" min="0" max="100" value={spins}/>
        <br />

        <span>
          <span style={{fontWeight: 'bold'}}>Stocks</span>
          <span style={{fontSize: 12, color: '#666'}}> +10% per year. Based on S&P 500 average from 1926-2018</span>
        </span>
        <span style={{fontSize: 20, fontWeight: 'bold'}}>{result}{currency}</span>
        <span style={{fontSize: 12, color: '#666'}}>After {years} years on the stockmarket you would on average have accumulated {result}{currency}. <span style={{color: '#000', borderBottom: '1px solid'}}>{withCommas(Math.round(raw_result - (start_money + ((monthly * 12) * years))))}{currency} in pure "winnings".</span></span>
        
        <br />
        <span>
          <span style={{fontWeight: 'bold'}}>Casino</span> <span style={{fontSize: 12, color: '#666'}}>-4% per spin. Based on average RTP 0.96 (return to player)</span>
        </span>
        <span style={{fontSize: 20, fontWeight: 'bold'}}>Lost: {withCommas(Math.round((start_money + ((monthly * 12) * years)) - raw_casino_result))}{currency}. Remaining: {casino_result}{currency}.</span>
        <span style={{fontSize: 12, color: '#666'}}>This is the average outcome of {spins * (years > 0 ? years : 1)} spins on the casino.</span>
        <br />
        <span>Yes, the stockmarket is also gambling, but it's not scientifically engineered to manipulate your brain into losing as much money as possible.</span>
        <br />
        <span>Open source, feel free to contribute on <a style={{color: '#0075ff', textDecoration: 'underline'}} href="https://github.com/Glutch/spintolose" target="_blank">Github</a></span>
      </div>
    </div>
  )
}