import {JSX, useEffect, useState} from 'react';
import {useLexicalNodeSelection} from "@lexical/react/useLexicalNodeSelection";
import {NodeKey} from "lexical";

type Props = {
    chartId: string,
    nodeKey: NodeKey
};

export default function ChartSVG({chartId, nodeKey}: Props): JSX.Element {
    const [SVGElement, setSVGElement] = useState<SVGElement | null>(null);
    const [, setSelected, ] = useLexicalNodeSelection(nodeKey);

    useEffect(() => {
        const setElement = async () => {
            const chartInstances = window?.Apex?._chartInstances;

            if (!Array.isArray(chartInstances)) {
                return;
            }

            const chartInstance = chartInstances.find((c) => c.id === chartId);
            if (chartInstance === undefined) {
                return;
            }

            // TODO add better error handling
            try {
                const svgString = await chartInstance.chart.exports.getSvgString();

                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
                const svgElement = svgDoc.firstElementChild

                if (svgElement === null) {
                    return;
                }

                const svgWidth = parseFloat(svgElement.getAttributeNS(null, 'width') ?? '0');
                const svgHeight = parseFloat(svgElement.getAttributeNS(null, 'height') ?? '0');

                svgElement.setAttributeNS(null, 'width', '100%')
                svgElement.setAttributeNS(null, 'height', '100%')
                svgElement.setAttributeNS(null, 'viewBox', '0 0 ' + svgWidth + ' ' + svgHeight)

                setSVGElement(svgElement as SVGElement);
                setSelected(false); // trigger an editor state update after this component finished rendering asynchronously
            } catch (e) {
                console.error('SVG creation failed', e);
            }
        };

        setElement();
    }, [chartId, setSelected]);

    return <p className={'inline-block w-[700px]'} dangerouslySetInnerHTML={{__html: SVGElement?.outerHTML ?? ''}}></p>;
}
