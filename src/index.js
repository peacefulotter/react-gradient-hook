import React from 'react';
import { createRoot } from 'react-dom/client';
import useGradient from './hooks/useGradient'

const App = () => {
    const gradient = useGradient({});
    return (
        <div style={{marginTop: '300px'}}>
            {gradient}
        </div>
    )
}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);