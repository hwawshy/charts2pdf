import {Accordion, Button, Center, Grid, Modal, Stack, Text} from "@mantine/core";
import {MultiSelectCreatable} from "./MultiSelectCreatable.tsx";
import {Dataset} from "./Dataset.tsx";
import {Suspense, JSX, useState, lazy, useEffect} from "react";
import {useMediaQuery} from "@mantine/hooks";
import {ApexOptions} from "apexcharts";
import {TAxisDataset} from "./ChartPlugin.tsx";

type Props = {
    closeModal: () => void,
    modalOpened: boolean,
    initialChartOptions: ApexOptions,
    initialChartSeries: Array<TAxisDataset>,
    onSave: (chartOptions: ApexOptions, chartSeries: Array<TAxisDataset>) => void
};

const ApexChart = lazy(async () => {
    const module = await import("react-apexcharts");
    return {default: module.default};
});

export default function ChartModal({closeModal, modalOpened, initialChartOptions, initialChartSeries, onSave}: Props): JSX.Element {
    const [chartOptions, setChartOptions] = useState<ApexOptions>(initialChartOptions);
    const [chartSeries, setChartSeries] = useState<Array<TAxisDataset>>(initialChartSeries);
    const desktop = useMediaQuery('(min-width: 992px)');

    useEffect(() => {
        setChartOptions(initialChartOptions);
        setChartSeries(initialChartSeries);
    }, [initialChartOptions, initialChartSeries]);

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
        setChartSeries([...chartSeries, {
            name: 'New Dataset',
            data: []
        }]);
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
                    <Button onClick={() => onSave(chartOptions, chartSeries)}>Save Chart</Button>
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