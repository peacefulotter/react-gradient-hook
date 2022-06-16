import { useState, useEffect, useRef } from 'react';

interface Size {
	left: number;
	width: number;
	height: number;
}

export const useRefSize = () => {

    const ref = useRef(null)
	const [size, setSize] = useState<Size>({ left: 0, width: 0, height: 0 });

	const resize = () => { 
		if ( ref.current === null ) return;
		// FIXME: + ref.current.clientLeft ??
		const left = ref.current.offsetLeft
		const width = ref.current.clientWidth
		const height = ref.current.clientHeight
		setSize( { left, width, height } );
	}

	useEffect( () => {
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [ref] );

	useEffect( resize, [])

	return { ref, ...size };
}

export default useRefSize;