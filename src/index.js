import React, { useState, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import Gradient from './Components/Gradient'
import { _cursorOptions, _gradientOptions } from './constants';

import './index.css'

const styles = {
    wrapper : {
        margin: '50px',
        display: 'flex'
    },
    container: {
        margin: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: '1.3em',
        marginBottom: '10px'
    }
}

const App = () => {

    const [gradOptions, setGradOptions] = useState(_gradientOptions);
    const [cursorOptions, setCursorOptions] = useState(_cursorOptions);

    const gradChange = key => ({target}) => 
        target.validity.valid && setGradOptions(prev => ({...prev, [key]: parseInt(target.value, 10)}))

    const cursorChange = key => ( {target} ) => {
        target.validity.valid && setCursorOptions(prev => ({...prev, [key]: parseInt(target.value, 10)}))
    }

    // border: 4,
    // shadow: 2,
    // scale: 5,
    // grid: false,
    // samples: 0,

    const { wrapper, container, title } = styles;

    return (
        <div>
            <div style={wrapper}>
                <div style={container}>
                    <div style={title}>Gradient Options</div>
                    Height: 
                    <input type='number' value={gradOptions.height} onChange={gradChange('height')}></input>
                </div>
                <div style={container}>
                    <div style={title}>Cursor Options</div>
                    Width: 
                    <input type='number' value={cursorOptions.width} onChange={cursorChange('width')}></input>
                    Border: 
                    <input type='number' value={cursorOptions.border} onChange={cursorChange('border')}></input>
                    Shadow: 
                    <input type='number' value={cursorOptions.shadow} onChange={cursorChange('shadow')}></input>
                    Scale: 
                    <input type='number' value={cursorOptions.scale} onChange={cursorChange('scale')}></input>
                    Grid: 
                    <input type='checkbox' value={cursorOptions.grid} onChange={() => setCursorOptions(prev => ({...prev, grid: !prev.grid}))}></input>
                    Samples: 
                    <input type='number' value={cursorOptions.samples} onChange={cursorChange('samples')}></input>
                </div>
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