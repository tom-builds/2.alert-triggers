import React, { useState } from 'react';
import './Css/App.css';

import Clock from './Components/Clock';
import ThreeBoxes from './Components/ThreeBoxes';


function App() {


    const [isDark, setLight] = useState(true)

    const handleClick = () => { setLight(isDark ? false : true) }


    return (


        <div className={isDark ? 'App dark mode' : 'App light mode'}>

         <div className='heading'>

            <span onClick={handleClick} className={isDark ? "icon fa fa-sun-o" : "icon fa fa-moon-o"}></span>

           <Clock/>

        </div>

         <ThreeBoxes/>

        </div>

    )
}

export default App
