"use client";
import {GradFlow} from 'gradflow'


// Want to create stunning backgrounds and play with the colors and values check: Check out https://gradflow.meera.dev/

export const GradientShader = () => {

    return (
        <div className="absolute size-full inset-0 bg-cyan-200">
            <GradFlow config={{
                color1: {r: 150, g: 230, b: 255},
                color2: {r: 100, g: 210, b: 245},
                color3: {r: 255, g: 180, b: 180},
                speed: 0.8,
                scale: 2,
                type: 'smoke',
                noise: 0.18
            }}/>

            {/* Your content here */}
        </div>
    );
};
