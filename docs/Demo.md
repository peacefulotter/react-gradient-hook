# Demo

```jsx harmony
import { Gradient } from 'react-gradient-hook';

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { _cursorOptions, _gradientOptions } from 'react-gradient-hook/constants';

import 'react-gradient-hook/index.css'

const styles = {
    wrapper : {
        margin: '40px 0px 70px 0px',
        display: 'flex',
        justifyContent: 'space-around'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    title: {
        fontSize: '1.3em',
        marginBottom: '10px',
        textTransform: 'capitalize'
    },
    color: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '50px 50px 50px 50px',
        gap: '10px'
    },
    input: {
        width: '100px'
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
                            ? <input style={styles.input} type='number' value={options[k]} onChange={valChange(k)}></input>
                            : <input style={styles.input} type='checkbox' checked={options[k]} onChange={boolChange(k)}></input>
                        }
                    </div>
                )
            }
        </div>
    ) ]
}

const Color = ({trgb}) => {

    const { r, g, b, t } = trgb;

    const f = (n, acc) => Math.round(n * acc) / acc

    return (
        <div style={styles.color}>
            <div>{`R: ${f(r, 1)}`}</div>
            <div>{`G: ${f(g, 1)}`}</div>
            <div>{`B: ${f(b, 1)}`}</div>
            <div>{`T: ${f(t, 100)}`}</div>
        </div>
    )
}

const Demo = () => {

    const [gradOptions, GradientOptions] = useOptionsElt(_gradientOptions, 'gradient');
    const [cursorOptions, CursorOptions] = useOptionsElt(_cursorOptions, 'cursor');
    const [colors, setColors] = useState([])

    return (
        <div>
            <div style={styles.wrapper}>
                <GradientOptions />
                <CursorOptions />
                <div style={styles.container}>
                    <div style={styles.title}>Colors</div>
                    { colors.map( (c, i) => <Color key={`color-${i}`} trgb={c} />) }
                </div>
            </div>
            <Gradient 
                gradientOptions={gradOptions}
                cursorOptions={cursorOptions} 
                onChange={setColors} />
        </div>
    )
}

<Demo />
```
