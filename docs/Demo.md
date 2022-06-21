# Demo

```jsx harmony
import { Gradient } from 'react-gradient-hook';


const Demo = () => {

    const [gradientOptions, cursorOptions, setColors, Options] = useGradientOptions()

    return (
        <div>
            <Options />
            <Gradient 
                gradientOptions={gradientOptions}
                cursorOptions={cursorOptions} 
                onChange={setColors} />
        </div>
    )
}

<Demo />
```
