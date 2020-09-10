

import React, { useCallback, useState, useRef, useEffect } from "react";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

const IMG_URL =
  "https://user-images.githubusercontent.com/4661784/" +
  "56037265-88219f00-5d37-11e9-95ef-9cb24be0190e.png";


function App () {

  const imgRef = useRef();
    const onUpdate = useCallback(({ x, y, scale }) => {
      console.log(scale)
      const { current: img } = imgRef;
   
      if (img) {
        const value = make3dTransformValue({ x, y, scale });
   
        img.style.setProperty("transform", value);
      }
    }, []);

  

  return (



   


    <div  >

  Boom

  <QuickPinchZoom onUpdate={onUpdate} maxZoom= {1000}>
       <img ref={imgRef} src={IMG_URL} />
     </QuickPinchZoom>

    </div>
  );

};

export default App;