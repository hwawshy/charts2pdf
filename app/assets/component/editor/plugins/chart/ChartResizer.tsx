import { LexicalEditor } from 'lexical';
import {JSX, useRef} from 'react';

type Props = {
    editor: LexicalEditor,
    chartContainerRef: {current: null | HTMLDivElement},
    onResizeStart: () => void,
    onResizeEnd: (width: number, height: number) => void,
}

enum Direction {
    East = 1 << 0,
    North = 1 << 3,
    South = 1 << 1,
    West = 1 << 2,
};

const clamp = (value: number, min: number, max: number) => {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

export default function ChartResizer({editor, chartContainerRef, onResizeStart, onResizeEnd}: Props): JSX.Element {
    const positioningRef = useRef<{
        currentHeight: number;
        currentWidth: number;
        direction: number;
        isResizing: boolean;
        ratio: number;
        startHeight: number;
        startWidth: number;
        startX: number;
        startY: number;
      }>({
        currentHeight: 0,
        currentWidth: 0,
        direction: 0,
        isResizing: false,
        ratio: 0,
        startHeight: 0,
        startWidth: 0,
        startX: 0,
        startY: 0,
      });

    const editorRootElement = editor.getRootElement();
    // Find max width, accounting for editor padding.
    const maxWidthContainer = editorRootElement !== null ? editorRootElement.getBoundingClientRect().width - 20 : 100;
    const maxHeightContainer = editorRootElement !== null ? editorRootElement.getBoundingClientRect().height - 32 : 100;

    const minWidth = 100;
    const minHeight = 100;

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>, direction: Direction,) => {
        if (chartContainerRef.current === null) {
            return;
        }

        onResizeStart();

        event.preventDefault();
        const chartContainer = chartContainerRef.current;
        const {width, height} = chartContainer.getBoundingClientRect();
        const positioning = positioningRef.current;
        positioning.startWidth = width;
        positioning.startHeight = height;
        positioning.ratio = width / height;
        positioning.currentWidth = width;
        positioning.currentHeight = height;
        positioning.startX = event.clientX;
        positioning.startY = event.clientY;
        positioning.isResizing = true;
        positioning.direction = direction;

        chartContainer.style.height = `${height}px`;
        chartContainer.style.width = `${width}px`;

        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointermove', onPointerMove);
    };

    const onPointerMove = (event: PointerEvent) => {
        const chartContainer = chartContainerRef.current;

        const positioning = positioningRef.current;

        const isHorizontal =
        positioning.direction & (Direction.East | Direction.West);
        const isVertical =
        positioning.direction & (Direction.South | Direction.North);

        let deltaX = Math.floor(event.clientX - positioning.startX);
        let deltaY = Math.floor(event.clientY - positioning.startY);

        if (chartContainer === null || positioning?.isResizing === false) {
            return;
        }

        if (isHorizontal && isVertical) {
            deltaX = (positioning.direction & Direction.East ? 1 : -1) * deltaX;

            const width = clamp(
                positioning.startWidth + deltaX,
                minWidth,
                maxWidthContainer,
              );

            const height = Math.floor(width / positioning.ratio);

            chartContainer.style.width = `${width}px`;
            chartContainer.style.height = `${height}px`;

            positioning.currentWidth = width;
            positioning.currentHeight = height;
        } else if (isHorizontal) {
            deltaX = (positioning.direction & Direction.East ? 1 : -1) * deltaX;
            const width = clamp(
                positioning.startWidth + deltaX,
                minWidth,
                maxWidthContainer,
              );
      
              chartContainer.style.width = `${width}px`;
              positioning.currentWidth = width;
        } else if (isVertical) {
            deltaY = (positioning.direction & Direction.South ? 1 : -1) * deltaY;
            const height = clamp(
                positioning.startHeight + deltaY,
                minHeight,
                maxHeightContainer,
              );
      
              chartContainer.style.height = `${height}px`;
              positioning.currentHeight = height;
        }
    }

    const onPointerUp = () => {
        const chartContainer = chartContainerRef.current;
        const positioning = positioningRef.current;

        if (chartContainer === null && !positioning?.isResizing) {
            return;
        }

        const width = positioning.currentWidth;
        const height = positioning.currentHeight;
        positioning.startWidth = 0;
        positioning.startHeight = 0;
        positioning.ratio = 0;
        positioning.startX = 0;
        positioning.startY = 0;
        positioning.currentWidth = 0;
        positioning.currentHeight = 0;
        positioning.isResizing = false;

        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointermove', onPointerMove);
        onResizeEnd(width, height);
    }

    return <>
        <div onPointerDown={(e) => onPointerDown(e, Direction.North | Direction.West)} className={"absolute h-[7px] w-[7px] left-[-5px] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-nw-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.North)} className={"absolute h-[7px] w-[7px] left-[48%] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-n-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.North | Direction.East)} className={"absolute h-[7px] w-[7px] right-[-5px] top-[-5px] bg-blue-500 border border-solid border-white box-content cursor-ne-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.East)} className={"absolute h-[7px] w-[7px] top-[48%] right-[-5px] bg-blue-500 border border-solid border-white box-content cursor-e-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.South | Direction.East)} className={"absolute h-[7px] w-[7px] bottom-[-5px] right-[-5px] bg-blue-500 border border-solid border-white box-content cursor-se-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.South)} className={"absolute h-[7px] w-[7px] left-[48%] bottom-[-5px] bg-blue-500 border border-solid border-white box-content cursor-s-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.South | Direction.West)} className={"absolute h-[7px] w-[7px] bottom-[-5px] left-[-5px] bg-blue-500 border border-solid border-white box-content cursor-sw-resize"}></div>
        <div onPointerDown={(e) => onPointerDown(e, Direction.West)} className={"absolute h-[7px] w-[7px] top-[48%] left-[-5px] bg-blue-500 border border-solid border-white box-content cursor-w-resize"}></div>
    </>
}