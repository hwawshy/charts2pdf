import {JSX, useEffect, useState} from 'react';
import {
    $createParagraphNode,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand
} from "lexical";
import {useDisclosure} from "@mantine/hooks";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createChartNode} from "./ChartNode";
import {$wrapNodeInElement} from "@lexical/utils";
import { v4 as uuid } from 'uuid';
import ChartModal from "./ChartModal.tsx";
import {ApexOptions} from "apexcharts";

export const INSERT_CHART_COMMAND: LexicalCommand<void> = createCommand(
    'INSERT_CHART_COMMAND',
);

export type TAxisDataset = {
    name: string,
    data: number[]
};

const initialId = uuid();

export default function ChartPlugin(): JSX.Element {
    const [modalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);
    const [editor] = useLexicalComposerContext();
    const [chartId, setChartId] = useState<string>(initialId)

    const initialChartOptions: ApexOptions = {
        chart: {
            id: chartId,
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true
            }
        },
        tooltip: {
            enabled: false,
        },
        title: {
            text: 'Cool Chart',
            align: 'center'
        },
        dataLabels: {
            enabled: false,
        },
        subtitle: {
            text: 'Some cool subtitle here',
            align: 'center'
        },
        xaxis: {
            categories: [
                1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
            ],
        },
        theme: {
            palette: 'palette1'
        },
        legend: {
            show: true,
        }
    };

    const initialChartSeries = [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }];

    useEffect(() => {
        return editor.registerCommand(
            INSERT_CHART_COMMAND,
            () => {
                openModal();

                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor, openModal]);

    const onSave = (chartOptions: ApexOptions, chartSeries: Array<TAxisDataset>): void => {
        editor.update(() => {
            const node = $createChartNode(
                JSON.stringify({
                    chartOptions,
                    chartSeries
                }), 400, 400)
            $insertNodes([node]);

            if ($isRootOrShadowRoot(node.getParentOrThrow())) {
                $wrapNodeInElement(node, $createParagraphNode).selectEnd();
            }
        });

        closeModal();
        setChartId(uuid());
    }

    return <ChartModal closeModal={closeModal} modalOpened={modalOpened} initialChartOptions={initialChartOptions} initialChartSeries={initialChartSeries} onSave={onSave} />;
}
