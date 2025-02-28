import {DecoratorNode, DOMExportOutput, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode} from "lexical";
import {JSX, Suspense} from 'react';
import ChartSVG from "./ChartSVG.tsx";

type SerializedChartNode = SerializedLexicalNode & {data: string, width: number, nodeKey: NodeKey};

export class ChartNode extends DecoratorNode<JSX.Element> {
    constructor(private __data: string, private __width: number, key?: NodeKey) {
        super(key);
    }

    static getType(): string {
        return 'chart-node';
    }

    static clone(node: ChartNode): ChartNode {
        return new ChartNode(node.__data, node.__width, node.__key);
    }

    static importJSON(serializedNode: SerializedChartNode): ChartNode {
        return new ChartNode(serializedNode.data, serializedNode.width, serializedNode.nodeKey);
    }

    updateDOM(): false {
        return false;
    }

    exportJSON(): SerializedChartNode {
        return {
            data: this.__data,
            nodeKey: this.getKey(),
            width: 100,
            type: ChartNode.getType(),
            version: 1,
        };
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('span');
        element.className = 'inline-block w-[700px]';

        const content = editor.getElementByKey(this.getKey());
        if (content !== null) {
            const svg = content.querySelector('svg');
            if (svg !== null) {
                element.innerHTML = svg.outerHTML;
            }
        }

        return {element}
    }

    createDOM(): HTMLElement {
        return document.createElement('span');
    }

    decorate(): JSX.Element {
        const {chartOptions: chartOptions} = JSON.parse(this.__data);

        return <Suspense fallback={null}>
                <ChartSVG chartId={chartOptions.chart.id} nodeKey={this.getKey()} />
        </Suspense>;
    }
}

export function $createChartNode(data: string, width: number, key?: NodeKey): ChartNode {
    return new ChartNode(data, width, key);
}

export function $isChartNode(node: LexicalNode | null | undefined): node is ChartNode  {
    return node instanceof ChartNode;
}
