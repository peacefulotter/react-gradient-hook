import { FC, MouseEvent, useEffect, useState } from "react";
import { FiTrash2 } from 'react-icons/fi'


interface ICursortTooltip {
    t: number;
    scale: number;
    onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const accuracy = 1000;

const CursorTooltip: FC<ICursortTooltip> = ( { t, scale, onClick } ) => {

    const [text, setText] = useState<any>()
    const [isHover, setIsHover] = useState<boolean>(false)

    useEffect( () => {
        setText( Math.round(t * scale * accuracy) / accuracy );
    }, [t, scale] )

    return (
        <div 
            className="cursor-text"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
        >
            {isHover ? <FiTrash2 /> : text}
        </div>
    )
}

export default CursorTooltip;