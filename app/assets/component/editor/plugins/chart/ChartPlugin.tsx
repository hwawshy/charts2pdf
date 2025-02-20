import {JSX, useEffect, useRef, useState} from 'react';
import {
    $createParagraphNode,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand
} from "lexical";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Accordion, Button, Center, Grid, Modal, Stack, Text} from '@mantine/core';
import {$createChartNode} from "./ChartNode";
import {$wrapNodeInElement} from "@lexical/utils";
import {MultiSelectCreatable} from "./MultiSelectCreatable";
import {Dataset} from "./Dataset.tsx";
import {lazy, Suspense} from "react";
import {ApexOptions} from "apexcharts";
import { v4 as uuid } from 'uuid';

export const INSERT_CHART_COMMAND: LexicalCommand<void> = createCommand(
    'INSERT_CHART_COMMAND',
);

export type TAxisDataset = {
    name: string,
    data: number[]
};

const ApexChart = lazy(async () => {
    const module = await import("react-apexcharts");
    return {default: module.default};
});

export default function ChartPlugin(): JSX.Element {
    const [modalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);
    const [editor] = useLexicalComposerContext();
    const desktop = useMediaQuery('(min-width: 992px)');
    const {current: chartId} = useRef<string>(uuid());
    const defaultDataset = {
        name: 'New Dataset',
        data: []
    };
    const [chartOptions, setChartOptions] = useState<ApexOptions>(
        {
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
            }
        }
    );

    const [chartSeries, setChartSeries] = useState<Array<TAxisDataset>>(
        [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }]
    );

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

    const onSave = (): void => {
        editor.update(() => {
            const node = $createChartNode(
                JSON.stringify({
                    chartId,
                    chartOptions,
                    chartSeries
                }), 100)
            $insertNodes([node]);

            if ($isRootOrShadowRoot(node.getParentOrThrow())) {
                $wrapNodeInElement(node, $createParagraphNode).selectEnd();
            }
        });

        closeModal();
    }

    const onLabelsChange = (labels: string[]) => {
        setChartOptions((current) => ({...current, xaxis: {...current.xaxis, categories: labels}}));
    };

    const onDatasetChange = (index: number, dataset: TAxisDataset): void => {
        if (chartSeries === undefined) {
            return;
        }

        const datasets = chartSeries.map((ds, i) => index === i ? dataset : ds);

        setChartSeries(datasets);
    }

    const onDatasetRemove = (index: number): void => {
        setChartSeries(chartSeries.filter((_, i) => index !== i))
    }

    const onDatasetAdd = () => {
        setChartSeries([...chartSeries, defaultDataset]);
    }

    const sizeProps = desktop ? {centered: true, size: '80%'} : {fullScreen: true};

    return <Modal opened={modalOpened} onClose={closeModal} {...sizeProps}>
        <Grid>
            <Grid.Col span={{base: 12, md: 4}}>
                <Stack justify={'flex-start'} gap={'40px'}>
                    <Stack justify={'flex-start'} gap={'15px'}>
                        <Text size={'md'}>X-axis labels</Text>
                        <MultiSelectCreatable values={chartOptions?.xaxis?.categories || []}
                                              onValuesChange={onLabelsChange}/>
                    </Stack>
                    <Accordion multiple defaultValue={['Dataset #1']}>
                        <Text size={'md'}>Datasets</Text>
                        {chartSeries.map((ds, index) =>
                            <Accordion.Item key={index} value={`Dataset #${index + 1}`}>
                                <Accordion.Control>{`Dataset #${index + 1}`}</Accordion.Control>
                                <Accordion.Panel>
                                    <>
                                        <Dataset labelsLength={chartOptions?.xaxis?.categories?.length || 0}
                                                 index={index} dataset={ds} onChange={onDatasetChange}/>
                                        {chartSeries.length > 1 && <Button
                                            color={'red'}
                                            size={'xs'}
                                            className={'mt-1.5'}
                                            onClick={() => onDatasetRemove(index)}
                                        >
                                            Remove Dataset
                                        </Button>}
                                    </>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )}
                        <Button color={'green'} className={'mt-2.5'} onClick={onDatasetAdd}>Add Dataset</Button>
                    </Accordion>
                    <Button onClick={onSave}>Save Chart</Button>
                </Stack>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 8}}>
                <Center className={desktop ? 'sticky top-[60px]' : ''}>
                    <div style={{width: `100%`, position: 'relative'}}>
                        <Suspense fallback={null}>
                            <ApexChart
                                series={chartSeries}
                                options={chartOptions}
                                type="bar"
                                width="100%"
                            />
                        </Suspense>
                    </div>
                </Center>
            </Grid.Col>
        </Grid>
    </Modal>;
}