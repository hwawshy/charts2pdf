import {DecoratorNode, DOMExportOutput, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode} from "lexical";
import {JSX, Suspense} from 'react';
import ChartComponent from "./ChartComponent.tsx";

type SerializedChartNode = SerializedLexicalNode & {data: string, width: number, height: number, nodeKey: NodeKey};

export class ChartNode extends DecoratorNode<JSX.Element> {
    constructor(private __data: string, private __width: number, private __height: number, key?: NodeKey) {
        super(key);
    }

    static getType(): string {
        return 'chart-node';
    }

    static clone(node: ChartNode): ChartNode {
        return new ChartNode(node.__data, node.__width, node.__height, node.__key);
    }

    static importJSON(serializedNode: SerializedChartNode): ChartNode {
        return new ChartNode(serializedNode.data, serializedNode.width, serializedNode.height, serializedNode.nodeKey);
    }

    setWidth(width: number): void {
        const self = this.getWritable();
        self.__width = width;
    }

    setHeight(height: number): void {
        const self = this.getWritable();
        self.__height = height;
    }

    updateDOM(): false {
        return false;
    }

    exportJSON(): SerializedChartNode {
        return {
            data: this.__data,
            nodeKey: this.getKey(),
            width: 100,
            height: 100,
            type: ChartNode.getType(),
            version: 1,
        };
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('span');
        element.className = 'inline-block';

        element.style.height = `${this.__height}px`;
        element.style.width = `${this.__width}px`;

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
        const element = document.createElement('span');
        element.className = 'relative inline-block'

        return element;
    }

    decorate(): JSX.Element {
        const {chartOptions: chartOptions} = JSON.parse(this.__data);

        return <Suspense fallback={null}>
                <ChartComponent chartId={chartOptions.chart.id} nodeKey={this.getKey()} />
        </Suspense>;
    }
}

export function $createChartNode(data: string, width: number, height: number, key?: NodeKey): ChartNode {
    return new ChartNode(data, width, height, key);
}

export function $isChartNode(node: LexicalNode | null | undefined): node is ChartNode  {
    return node instanceof ChartNode;
}
