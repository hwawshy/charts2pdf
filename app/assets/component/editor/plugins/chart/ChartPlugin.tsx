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
import {Accordion, Button, Center, Grid, Modal, Slider, Stack, Text} from '@mantine/core';
import Chart from "chart.js/auto";
import {Bar} from "react-chartjs-2";
import {CategoryScale} from "chart.js";
import {$createChartNode} from "./ChartNode";
import {$wrapNodeInElement} from "@lexical/utils";
import {MultiSelectCreatable} from "./MultiSelectCreatable";
import {Dataset, TDataset} from "./Dataset.tsx";
import {ChartJSOrUndefined} from "react-chartjs-2/dist/types";

export const INSERT_CHART_COMMAND: LexicalCommand<void> = createCommand(
    'INSERT_CHART_COMMAND',
);

Chart.register(CategoryScale);

type ChartData = {
    labels: string[],
    datasets: Array<TDataset>
};

export default function ChartPlugin(): JSX.Element {
    const [modalOpened, {open: openModal, close: closeModal}] = useDisclosure(false);
    const [editor] = useLexicalComposerContext();
    const [dataUrl, setDataUrl] = useState<null | string>(null);
    const [size, setSize] = useState<number>(100);
    const [width, setWidth] = useState<number>(0);
    const chartRef = useRef<ChartJSOrUndefined<'bar'>>(null);
    const desktop = useMediaQuery('(min-width: 992px)');
    const defaultDataset = {
        label: 'Monthly Sales',  // The label for the dataset
        data: [65, 59, 80, 81, 56, 55, 40],  // Data points corresponding to the labels
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Bar color
        borderColor: 'rgba(75, 192, 192, 1)',  // Border color
        borderWidth: 1  // Border width
    };
    const [chartData, setChartData] = useState<ChartData>({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],  // X-axis labels
        datasets: [defaultDataset]
    });

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

    useEffect(() => {
        chartRef.current?.resize();
    }, [size]);

    const onSave = (): void => {
        if (dataUrl === null) {
            return;
        }

        editor.update(() => {
            const node = $createChartNode(dataUrl, width)
            $insertNodes([node]);

            if ($isRootOrShadowRoot(node.getParentOrThrow())) {
                $wrapNodeInElement(node, $createParagraphNode).selectEnd();
            }
        });

        closeModal();
    }

    const onLabelsChange = (labels: string[]) => {
        setChartData((current) => ({...current, labels: labels}));
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            onComplete: function (e: { chart: { toBase64Image: () => string } }): void {
                setDataUrl(e.chart.toBase64Image());
            },
        },
        onResize: (_, size: {width: number}) => setWidth(size.width),
    }

    const onDatasetChange = (index: number, dataset: TDataset): void => {
        const datasets = chartData.datasets.map((ds, i) => index === i ? dataset : ds);

        setChartData((current: ChartData) => {
            return {...current, datasets: datasets};
        })
    }

    const onDatasetRemove = (index: number): void => {
        setChartData((current: ChartData) => ({...current, datasets: current.datasets.filter((_, i) => index !== i)})
        )
    }

    const onDatasetAdd = () => {
        setChartData((current) => ({...current, datasets: [...current.datasets, defaultDataset]})
        )
    }

    const sizeProps = desktop ? {centered: true, size: '80%'} : {fullScreen: true};

    return <Modal opened={modalOpened} onClose={closeModal} {...sizeProps}>
        <Grid>
            <Grid.Col span={{base: 12, md: 4}} >
                <Stack justify={'flex-start'} gap={'40px'}>
                    <Stack justify={'flex-start'} gap={'15px'}>
                        <Text size={'md'}>Chart size</Text>
                        <Slider min={1} max={100}  value={size} onChange={setSize} marks={[
                            { value: 20, label: '20%' },
                            { value: 50, label: '50%' },
                            { value: 80, label: '80%' },
                        ]} />
                    </Stack>
                    <Stack justify={'flex-start'} gap={'15px'}>
                        <Text size={'md'}>X-axis labels</Text>
                        <MultiSelectCreatable values={chartData.labels} onValuesChange={onLabelsChange} />
                    </Stack>
                    <Accordion multiple defaultValue={['Dataset #1']}>
                        <Text size={'md'}>Datasets</Text>
                        {chartData.datasets.map((ds, index) =>
                            <Accordion.Item key={index} value={`Dataset #${index + 1}`}>
                                <Accordion.Control>{`Dataset #${index + 1}`}</Accordion.Control>
                                <Accordion.Panel>
                                    <>
                                        <Dataset labelsLength={chartData.labels.length} index={index} dataset={ds} onChange={onDatasetChange} />
                                        {chartData.datasets.length > 1 && <Button
                                            color={'red'}
                                            size={'xs'}
                                            className={'mt-1.5'}
                                            onClick={() => onDatasetRemove(index)}
                                        >
                                            Remove
                                        </Button>}
                                    </>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )}
                        <Button color={'green'} className={'mt-2.5'} onClick={onDatasetAdd}>Add</Button>
                    </Accordion>
                    <Button className={'w-20'} onClick={onSave}>Save</Button>
                </Stack>
            </Grid.Col>
            <Grid.Col span={{base: 12, md: 8}}>
                <Center className={desktop ? 'sticky top-[60px]' : ''}>
                    <div style={{width: `${size}%`, position: 'relative'} }>
                        <Bar ref={chartRef} data={chartData} options={options} />
                    </div>
                </Center>
            </Grid.Col>
        </Grid>
    </Modal>;
}