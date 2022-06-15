import { useState, useEffect, useRef } from 'react';

interface Size {
	width: number;
	height: number;
}

export const useRefSize = () => {

    const ref = useRef(null)
	const [size, setSize] = useState<Size>({ width: 1, height: 1 });

	const handleResize = () => { 
		if ( ref.current === null ) return;
		const width = ref.current.clientWidth
		const height = ref.current.clientHeight
		setSize( { width, height } );
	}

	useEffect( () => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [ref] );

	useEffect( () => {
		handleResize()
	}, [])

	return { ref, ...size };
}

export default useRefSize;