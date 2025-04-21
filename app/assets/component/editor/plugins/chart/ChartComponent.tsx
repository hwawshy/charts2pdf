import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW, isDOMNode, NodeKey } from "lexical";
import ChartSVG from "./ChartSVG";
import { useEffect, useRef, useState } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import ChartResizer from "./ChartResizer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isChartNode } from "./ChartNode";

type Props = {
    chartId: string,
    nodeKey: NodeKey
};

export default function ChartComponent({chartId, nodeKey}: Props): JSX.Element {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const isEditable = useLexicalEditable();
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const onResizeStart = () => {
      setIsResizing(true);
    };

    const onResizeEnd = (nextWidth: number, nextHeight: number) => {
      // Delay hiding the resize bars for click case
      setTimeout(() => {
        setIsResizing(false);
      }, 200);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
  
        if ($isChartNode(node)) {
          node.setWidth(nextWidth);
          node.setHeight(nextHeight);
        }
      });
    };

    useEffect(() => {
        if (!isEditable) {
          if (isSelected) {
            clearSelection();
          }
          return;
        }
        return editor.registerCommand(
            CLICK_COMMAND,
            (event: MouseEvent) => {
                const buttonElem = buttonRef.current;
                const eventTarget = event.target;

                if (isResizing) {
                  return true;
                }

                if (
                    buttonElem !== null &&
                    isDOMNode(eventTarget) &&
                    buttonElem.contains(eventTarget as Node)
                  ) {
                    setSelected(!isSelected);

                    return true;
                  }

                  return false
            },
            COMMAND_PRIORITY_LOW,
          );
      }, [clearSelection, editor, isSelected, setSelected, isEditable, isResizing]);

    return <>
      <button ref={buttonRef} className={`border-0 p-0 m-0 bg-transparent outline-blue-500 outline-2 ${isSelected ? 'outline' : ''}`}>
          <ChartSVG chartContainerRef={chartContainerRef} chartId={chartId} nodeKey={nodeKey} />
          {isEditable && isSelected && <ChartResizer editor={editor} onResizeStart={onResizeStart} onResizeEnd={onResizeEnd} chartContainerRef={chartContainerRef} />}
      </button>
    </>;
}