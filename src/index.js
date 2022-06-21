import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Gradient from './Components/Gradient'
import { _cursorOptions, _gradientOptions } from './constants';

import './index.css'

const styles = {
    wrapper : {
        margin: '40px 0px 70px 0px',
        display: 'flex'
    },
    container: {
        margin: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    title: {
        fontSize: '1.3em',
        marginBottom: '10px',
        textTransform: 'capitalize'
    }
}

const useOptionsElt = ( defaultOptions, name ) => {

    const [options, setOptions] = useState(defaultOptions);

    const valChange = key => ( {target} ) => {
        target.validity.valid && setOptions(prev => ({...prev, [key]: parseInt(target.value, 10)}))
    }

    const boolChange = key => () => {
        setOptions(prev => ({...prev, [key]: !prev[key]}))
    }

    return [ options, () => (
        <div style={styles.container}>
            <div style={styles.title}>{name} Options</div>
            {
                Object.keys(options).map((k, i) => 
                    <div key={`${name}-opt-${i}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'}}>
                        <div style={{textTransform: 'capitalize'}}>{k}</div>
                        { typeof options[k] === 'number'
                            ? <input type='number' value={options[k]} onChange={valChange(k)}></input>
                            : <input type='checkbox' checked={options[k]} onChange={boolChange(k)}></input>
                        }
                    </div>
                )
            }
        </div>
    ) ]
}

const App = () => {

    const [gradOptions, GradientOptions] = useOptionsElt(_gradientOptions, 'gradient');
    const [cursorOptions, CursorOptions] = useOptionsElt(_cursorOptions, 'cursor');

    return (
        <div>
            <div style={styles.wrapper}>
                <GradientOptions />
                <CursorOptions />
            </div>
            <Gradient 
                gradientOptions={gradOptions}
                cursorOptions={cursorOptions} />
        </div>
    )
}

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<App />);