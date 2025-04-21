import { CLICK_COMMAND, COMMAND_PRIORITY_LOW, isDOMNode, NodeKey } from "lexical";
import ChartSVG from "./ChartSVG";
import { useEffect, useRef } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import ChartResizer from "./ChartResizer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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
                console.log(isSelected)
                const buttonElem = buttonRef.current;
                const eventTarget = event.target;

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
      }, [clearSelection, editor, isSelected, setSelected, isEditable]);

      return <ChartSVG chartContainerRef={chartContainerRef} chartId={chartId} nodeKey={nodeKey} />;

    /* return <>
      <button ref={buttonRef} className={`border-0 p-0 m-0 bg-transparent outline-blue-500 outline-2 ${isSelected ? 'outline' : ''}`}>
          <ChartSVG chartContainerRef={chartContainerRef} chartId={chartId} nodeKey={nodeKey} />
          {isEditable && isSelected && <ChartResizer chartContainerRef={chartContainerRef} />}
      </button>
    </>; */
}