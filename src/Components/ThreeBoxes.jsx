import React, { useRef, useState, useReducer, useEffect } from 'react';

import '../Css/bell.css'
import '../Css/threeboxes.css'



  function reducer(state, action) {

    return [action.payload, ...state]

  }

export default function Alerts() {

  const [alertList, setAnAlert] = useState([])

  const [orders, dispatch] = useReducer(reducer, [])

  const inputRef = useRef()

  // Error check user input  

  const addAlert = () => {

    let input = inputRef.current;
    let alertPrice = input.value;

    if (!Number(input.value)) {
      alert('Number please')
    }

    else if (Number(input.value)) { setAnAlert([...alertList, alertPrice]) }
    input.value = ''
  }

  // Get orders' info from Bitfinex 

  useEffect(() => {

    const wss = new WebSocket("wss://api.bitfinex.com/ws")

    wss.onopen = () => {

      wss.send(
        JSON.stringify({ event: "subscribe", channel: "trades", pair: "tETHUSD" })
      )

    }

    wss.onmessage = (msg) => {

      const res = JSON.parse(msg.data)
      const tu = res[1] === 'tu'

      if (tu) {

        let price = res[5].toFixed(0)
        let amount = res[6].toFixed(5)
        let id = res[2]
        let time = new Date().toLocaleTimeString()

        let order = { id, time, price, amount }

        dispatch({ type: "ADD_ORDER", payload: order })

      }
    };
  }, [])

  // show / hide alerts 

  const removeAlert = (i) => {
    const newAlerts = alertList.filter((_, alertIndex) => alertIndex !== i)
    setAnAlert(newAlerts)
  }

  // Logic to check price alerts and display bell 

  let alerting = ''

  const stopBell = () => { bell.current.className = 'fa fa-bell-o' }

  const bell = useRef()

  orders.forEach(p => {
    alertList.forEach(j => {

      let check = Number(j) - Number(p.price)

      if (Math.abs(check) < 100) {

        bell.current.className = 'fa fa-bell-o shake'
        alerting = 'The Price Is ' + p.price

        setTimeout(stopBell, 5000)
      }

    })
  })


  return (

    <div className="boxes-wrapper">

      <div className="box orderbook">

        <h2>ETH Order Book</h2>

        <table>

          <thead>
            <tr><th>Time</th><th>Price</th><th>Amount</th></tr>
          </thead>

          <tbody>
            {
              orders.map(({ time, price, amount }, i) => 

                i < 10 ? <tr key={i}><td>{time}</td><td>{price}</td><td>{amount}</td></tr> : ''
                

              )
            }
          </tbody>
        </table>
        
      </div>

      <div className="box alert">

        <div className="header">

          <h2>Add Alert</h2>

          <input ref={inputRef} placeholder="Add Alert Price" maxLength="10" />

          <button onClick={addAlert}>Add</button>

        </div>

        <ul>
          {
            alertList.map((alert, i) => (

              <li key={i}>
                <i className="fa fa-dollar"></i>{alert}
                <i className="fa fa-remove" onClick={() => removeAlert(i)}></i>
              </li>

            ))
          }
        </ul>
      </div>

      <div className="box bell">

        <h2>Bell</h2>

        {alerting}

        <i ref={bell}></i>

      </div>

    </div>

  )
}
