import {DecoratorNode, DOMExportOutput, LexicalEditor, LexicalNode, NodeKey} from "lexical";
import {JSX, Suspense} from 'react';
import ChartSVG from "./ChartSVG.tsx";

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

    updateDOM(): false {
        return false;
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
        const {chartId, chartOptions, chartSeries} = JSON.parse(this.__data);

        return <Suspense fallback={null}>
                <ChartSVG chartId={chartId} chartOptions={chartOptions} chartSeries={chartSeries} nodeKey={this.getKey()} />
        </Suspense>;
    }
}

export function $createChartNode(data: string, width: number, key?: NodeKey): ChartNode {
    return new ChartNode(data, width, key);
}

export function $isChartNode(node: LexicalNode | null | undefined): node is ChartNode  {
    return node instanceof ChartNode;
}
