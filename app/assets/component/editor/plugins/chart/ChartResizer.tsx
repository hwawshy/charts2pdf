import {JSX} from 'react';

type Props = {
    chartContainerRef: {current: null | HTMLDivElement}
}

export default function ChartResizer({chartContainerRef}: Props): JSX.Element {
    return <>
        <div className={"absolute h-[7px] w-[7px] left-[-5px] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-nw-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] left-[48%] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-n-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] right-[-5px] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-ne-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] top-[48%] right-[-5px] bg-blue-500 border border-solid border-white box-content cursor-e-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] bottom-[-5px] right-[-5px] bg-blue-500 border border-solid border-white box-content cursor-se-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] left-[48%] bottom-[-5px] bg-blue-500 border border-solid border-white box-content cursor-s-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] bottom-[-5px] left-[-5px] bg-blue-500 border border-solid border-white box-content cursor-sw-resize"}></div>
        <div className={"absolute h-[7px] w-[7px] top-[48%] left-[-5px] bg-blue-500 border border-solid border-white box-content cursor-w-resize"}></div>
    </>
}