import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum, setRepeatAudio,startRepeatAudio,stopRepeatAudio } from "../../components/CommonFunctions"

let timerList = []
//3.5,-3.5,
// 5,-5

let isGameStarted = false;
let currentNum = 0;
let stepNumRange = 10;
let currentStep = 0

export default function Scene2({ finishGame, _baseGeo, stopSound }) {
    const audioList = useContext(UserContext)

    const baseRef = useRef()
    const backRef = useRef()

    const greenStar = useRef();
    const redStar = useRef();
    const lastBoy = useRef();

    const targetRange = 0.0685
    const stepRange = -0.04

    const layoutStartPos = { x: -1.4, y: 0.5 }
    const translateStartPos = { x: 1.4, y: 0.5 }

    const characterList = Array.from({ length: 5 }, ref => useRef())
    const starList = Array.from({ length: 100 }, ref => useRef())
    const starBaseList = Array.from({ length: 100 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())

    // width : + -> -
    // height : - ->+


    const heightList = [
        0, -2, 0, -2, 0, -2, 0, -2, 0, -2,
        0, -2, 0, -2, 0, -2, 0, -2, 0, -2,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -2, 0, -2, 0, -2, 0, -2, 0, -2,
        0, -2, 0, -2, 0, -2, 0, -2, 0, -2,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -2, 0, -2, 0, -2, 0, -2, 0, -2,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
    ]

    const widthStep = 0.684

    useEffect(
        () => {

            setRepeatAudio(audioList.repeatAudio)
            isGameStarted = true;

            greenStar.current.style.opacity = 0
            redStar.current.style.opacity = 0


            characterList.map((character, index) => {
                if (index > 0)
                    character.current.setClass('hideObject')
            })


            backRef.current.style.transition = '0s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                + _baseGeo.height * (translateStartPos.y) + 'px)'


            return () => {

                isGameStarted = false;
                currentNum = 0;
                currentStep = 0

                audioList.clapAudio.pause();
            }
        }, []
    )

    if (isGameStarted)
        reRenderingFunc()

    function reRenderingFunc() {
        backRef.current.style.transition = '0s'

        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
            + _baseGeo.height * (translateStartPos.y) + 'px)'

        characterList[0].current.setPosInfo({
            l: layoutStartPos.x + 0.05 + targetRange * currentNum,
            b: layoutStartPos.y + 0.02 + stepRange * heightList[currentNum - 1]
        })
    }

    function clickFunc(num) {

        stopRepeatAudio();
        if (currentNum == 0)
            stopSound();

        if (num >= currentNum) {
            let currentStar = starBaseList[num]
            currentStar.current.style.transition = '0.1s'
            currentStar.current.style.transform = 'scale(0.95)'
            setTimeout(() => {
                currentStar.current.style.transform = 'scale(1)'
            }, 100);

            redStar.current.style.opacity = 0
            greenStar.current.style.opacity = 0

            if (num + 1 == currentNum + stepNumRange) {

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();


                baseRef.current.style.pointerEvents = 'none'

                starBaseList[currentNum].current.style.cursor = 'default'
                starBaseList[currentNum + 1].current.style.cursor = 'default'



                currentNum += stepNumRange;
                showButtonAni(greenStar, num)

                setTimeout(() => {

                    for (let i = 1; i < 5; i++) {
                        characterList[i].current.setPosInfo({
                            l: layoutStartPos.x + 0.05 + targetRange * (currentNum - stepNumRange) + i * 0.02,
                            b: layoutStartPos.y + 0.04 + stepRange * heightList[currentNum - stepNumRange - 1]
                        })
                    }

                    let num = 0;
                    let interval = setInterval(() => {
                        characterList[num].current.setClass('hideObject')

                        characterList[0].current.setPosInfo({
                            l: layoutStartPos.x + 0.063 + targetRange * currentNum,
                            b: layoutStartPos.y + 0.04 + stepRange * heightList[currentNum - 1]
                        })

                        if (num == 4) {
                            clearInterval(interval)
                            characterList[0].current.setClass('showObject')

                        }
                        else {
                            num++
                            characterList[num].current.setClass('showObject')
                        }
                    }, 150);


                    setTimeout(() => {

                        if (currentNum % 10 == 0) {

                            currentStep++;

                            backRef.current.style.transition = '2s'
                            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translateStartPos.x - currentStep * widthStep)) + 'px, '
                                + _baseGeo.height * (translateStartPos.y) + 'px)'

                            setTimeout(() => {
                                greenStar.current.style.opacity = 0

                                for (let i = currentNum - 10; i < currentNum; i++) {
                                    starList[i].current.setUrl('SB54_Prop-Interactive/PI_woodden_box_inactivate_01.svg')
                                    numberList[i].current.setStyle({ opacity: 0.4 })
                                    starBaseList[i].current.style.cursor = 'default'
                                }
                                baseRef.current.style.pointerEvents = ''
                                if (currentStep == 10) {
                                    characterList[0].current.setClass('hideObject')
                                    lastBoy.current.setClass('showOjbect')

                                    audioList.bodyAudio.play();
                                    audioList.clapAudio.play();

                                    setTimeout(() => {
                                        baseRef.current.style.transition = '0.7s'
                                        baseRef.current.style.opacity = 0

                                        setTimeout(() => {
                                            finishGame();
                                        }, 700);
                                    }, 5000);
                                }
                                else{
                                    startRepeatAudio()
                                }
                            }, 2000);
                        }

                        else {
                            for (let i = currentNum - 5; i < currentNum; i++) {
                                starBaseList[i].current.style.cursor = 'default'
                            }
                            baseRef.current.style.pointerEvents = ''
                            startRepeatAudio();
                        }


                    }, 1000);
                }, 200);
            }
            else {

                startRepeatAudio()
                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();
                
                showButtonAni(redStar, num)
            }
        }
    }

    function showButtonAni(obj, num) {

        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'
        obj.current.style.bottom = (layoutStartPos.y + 0.12 + heightList[num] * stepRange) * 100 + '%'
        obj.current.style.left = (layoutStartPos.x + 0.183 + num * targetRange) * 100 + '%'

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1
        }, 100);
    }


    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(12)'
                    }}
                    src={prePathUrl() + "images/SB54_BG/SB_54_forest_bg-01.svg"}
                />

                {
                    Array.from(Array(100).keys()).map(value =>

                        <div
                            ref={starBaseList[value]}
                            onClick={() => { clickFunc(value) }}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '11%',
                                cursor: 'pointer',
                                bottom: (layoutStartPos.y + 0.12 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutStartPos.x + 0.18 + value * targetRange) * 100 + '%'
                            }}>

                            < BaseImage
                                ref={starList[value]}
                                url={'SB54_Prop-Interactive/PI_woodden_box_01.svg'}
                            />
                            < BaseImage
                                ref={numberList[value]}
                                scale={0.5}
                                posInfo={{ l: 0.22, t: 0.35 }}
                                url={'SB54_Text-Interactive/TI_G3_' + generateStandardNum(value + 1) + '.svg'}
                            />
                        </div>
                    )
                }

                < BaseImage
                    scale={0.5}
                    // ref={lastBoy}
                    // className='hideObject'
                    posInfo={{
                        l: layoutStartPos.x + 7.05,
                        b: layoutStartPos.y + 0.105
                    }}
                    url={'SB54_Prop-Interactive/SB54_Apple_tree_01.svg'}
                />

                < BaseImage
                    scale={0.18}
                    ref={lastBoy}
                    className='hideObject'
                    posInfo={{
                        l: layoutStartPos.x + 7.1,
                        b: layoutStartPos.y + 0.105
                    }}
                    url={'SB54_Prop-Interactive/SB54_Boy_01.svg'}
                />
                <div
                    ref={greenStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.118 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.183 + targetRange * 0) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_Woodden_box_Green_HL_01.svg'}
                    />
                </div>

                <div
                    ref={redStar}
                    style={{
                        position: 'absolute',
                        width: '7.5%',
                        height: '11%',
                        pointerEvents: 'none',
                        bottom: (layoutStartPos.y + 0.12 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutStartPos.x + 0.183) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB54_Prop-Interactive/PI_Woodden_box_Red_HL_01.svg'}
                    />
                </div>


                {Array.from(Array(5).keys()).map(value =>
                    <BaseImage
                        scale={0.8}
                        ref={characterList[value]}
                        posInfo={{
                            l: layoutStartPos.x + 0.05,
                            b: layoutStartPos.y + 0.02
                        }}
                        url={'SB54_Animation/boy/SB54_CI_boy_0' + [value + 1] + '.svg'}
                    />
                )}

            </div>
        </div>
    );

}
