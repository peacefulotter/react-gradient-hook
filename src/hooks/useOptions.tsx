

import {  useEffect, useState } from 'react';

function useOptions<T>( options: T, defaultOptions: Required<T> ): Required<T> 
{
    const [opts, setOpts] = useState<Required<T>>(Object.assign(defaultOptions, options))

    useEffect( () => {
        setOpts( Object.assign(defaultOptions, options) )
    }, [options])

    return opts;
}

export default useOptions;