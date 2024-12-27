import {DecoratorNode, DOMExportOutput, LexicalNode, NodeKey} from "lexical";
import {JSX} from 'react';

export class ChartNode extends DecoratorNode<JSX.Element> {
    constructor(private __dataUrl: string, private __width: number, __key?: NodeKey) {
        super(__key);
    }

    static getType(): string {
        return 'chart-node';
    }

    static clone(node: ChartNode): ChartNode {
        return new ChartNode(node.__dataUrl, node.__width, node.__key);
    }

    updateDOM(): false {
        return false;
    }

    exportDOM(): DOMExportOutput {
        const imageElement = document.createElement('img');

        imageElement.src = this.__dataUrl;
        imageElement.style.width = `${this.__width}px`
        imageElement.style.height = `auto`

        const element = document.createElement('span');
        element.className = 'inline-block';
        element.appendChild(imageElement);

        return {element};
    }

    createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = 'inline-block';

        return span;
    }

    decorate(): JSX.Element {
        return <img src={this.__dataUrl} style={{width: `${this.__width}px`, height: 'auto'}} alt={'Chart'} />
    }
}

export function $createChartNode(dataUrl: string, width: number, key?: NodeKey): ChartNode {
    return new ChartNode(dataUrl, width, key);
}

export function $isChartNode(node: LexicalNode | null | undefined): node is ChartNode  {
    return node instanceof ChartNode;
}
