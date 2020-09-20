import React, { useRef, useLayoutEffect } from 'react';
import panzoom from 'panzoom';

function App () {
    const elementRef = useRef(null);
    const panzoomRef = useRef(null);

    // Set up panzoom on mount, and dispose on unmount
    useLayoutEffect(() => {
        panzoomRef.current = panzoom(elementRef.current, {
            minZoom: .25,
            maxZoom: 100000000000
        });

        panzoomRef.current.on('pan', () => console.log('Pan!'));
        panzoomRef.current.on('zoom', () => console.log('Zoom!'));

        return () => {
            panzoomRef.current.dispose();
        }
    }, []);

    return <div ref={elementRef}>
        Hello
    </div>

}

export default App;