

import { ReactElement, useState } from 'react';

import Gradient from '../Components/Gradient';

import { GradientProps, TRGB } from '../types';


const useGradient = ( props: GradientProps ): [TRGB[], ReactElement<any, any>] => {
    const [colors, setColors] = useState<TRGB[]>()
    return [colors, <Gradient {...props} onChange={setColors} />]
}

export default useGradient;