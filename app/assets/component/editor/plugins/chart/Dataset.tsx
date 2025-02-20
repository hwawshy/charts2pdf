import {ChangeEvent, JSX, useState} from 'react';
import {Stack, Textarea, TextInput} from "@mantine/core";
import {TAxisDataset} from "./ChartPlugin.tsx";
import {useDebouncedCallback} from "@mantine/hooks";

export function Dataset({dataset, onChange, index, labelsLength}: {
    dataset: TAxisDataset,
    onChange: (index: number, ds: TAxisDataset) => void,
    index: number,
    labelsLength: number
}): JSX.Element {
    const [textareaData, setTextareaData] = useState<string>(dataset.data.join('\n'));
    const [textareaError, setTextareaError] = useState<boolean>(false);
    const [name, setName] = useState<string>(dataset.name);

    const debouncedOnDataChange = useDebouncedCallback((index, ds) => onChange(index, ds), 200);

    const onValueChange = (key: string, value: string | number) => {
        if (key === 'name') {
            setName(String(value));
        }

        debouncedOnDataChange(index, {...dataset, [key]: value});
    }

    const onDataChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        const value = e.target.value;
        setTextareaData(value);

        const data = value
            .split('\n')
            .filter((v) => !Number.isNaN(Number(v)))
            .map(v => Number(v))
            .slice(0, labelsLength);

        setTextareaError(data.length !== value.split('\n').length);

        debouncedOnDataChange(index, {...dataset, data: data});
    }

    return <Stack justify={'flex-start'} gap={'15px'}>
        <TextInput
            label="Name"
            placeholder="Choose a dataset name"
            description="Choose a dataset name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange('name', e.target.value)}
        />
        <Textarea
            label={'Data'}
            placeholder={'Data points, one per line'}
            description={'Data points, one per line'}
            autosize
            minRows={5}
            maxRows={10}
            onChange={onDataChange}
            value={textareaData}
            error={textareaError}
        />
    </Stack>
}