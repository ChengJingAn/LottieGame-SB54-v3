import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum } from "../../components/CommonFunctions"

let timerList = []
//-0.5,1.25,5,-5

export default function Review1({ _baseGeo, nextFunc }) {
    const audioList = useContext(UserContext)
    const starBaseList = Array.from({ length: 10 }, ref => useRef())
    const baseRef = useRef()

    useEffect(
        () => {
            timerList[0] = setTimeout(() => {
                starBaseList.map((star, index) => {
                    setTimeout(() => {
                        star.current.className = 'show'
                    }, 400 * index);
                })
            }, 1500);

            timerList[1] = setTimeout(() => {
                nextFunc()
            }, 8000);

            return () => {
                timerList.map(timer => {
                    clearTimeout(timer)
                })
            }
        }, []
    )

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                {
                    Array.from(Array(10).keys()).map(value =>
                        <div
                            ref={starBaseList[value]}
                            className='hide'
                            style={{
                                position: 'absolute',
                                width: '14%',
                                height: '14%',
                                cursor: 'pointer',
                                top: (0.25 + 0.3 * parseInt((value / 5))) * 100 + '%',
                                left: (0.12 + (value % 5) * 0.16) * 100 + '%',

                            }}>

                            < BaseImage
                                url={'SB54_Prop-Interactive/PI_woodden_box_01.svg'}
                            />
                            < BaseImage
                                scale={0.5}
                                posInfo={{ l: 0.22, t: 0.38 }}
                                url={'SB54_Text-Interactive/TI_G2_' + generateStandardNum((value + 1) * 10) + '.svg'}
                            />
                        </div>
                    )
                }


            </div>
        </div>
    );

}
