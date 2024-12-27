import {ChangeEvent, JSX, useState} from 'react';
import {ColorInput, NumberInput, Stack, Textarea, TextInput} from "@mantine/core";

export type TDataset = {
    label: string,
    borderWidth: number,
    data: number[],
    backgroundColor: string,
    borderColor: string
};

export function Dataset({dataset, onChange, index, labelsLength}: {
    dataset: TDataset,
    onChange: (index: number, ds: TDataset) => void,
    index: number,
    labelsLength: number
}): JSX.Element {
    const [textareaData, setTextareaData] = useState<string>(dataset.data.join('\n'));
    const [textareaError, setTextareaError] = useState<boolean>(false);

    const onValueChange = (key: string, value: string | number) => {
        onChange(index, {...dataset, [key]: value});
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

        onChange(index, {...dataset, data: data});
    }

    return <Stack justify={'flex-start'} gap={'15px'}>
        <TextInput
            label="Label"
            placeholder="Choose a dataset label"
            description="Choose a dataset label"
            value={dataset.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onValueChange('label', e.target.value)}
        />
        <ColorInput
            label="Background color"
            placeholder="Choose a background color"
            value={dataset.backgroundColor}
            onChange={(value) => onValueChange('backgroundColor', value)}
        />
        <ColorInput
            label="Border color"
            placeholder="Choose a background color"
            value={dataset.borderColor}
            onChange={(value) => onValueChange('borderColor', value)}
        />
        <NumberInput
            label="Border width"
            placeholder="Choose a value between 1 and 10"
            description="Choose a value between 1 and 10"
            min={1}
            max={10}
            value={dataset.borderWidth}
            onChange={(value) => onValueChange('borderWidth', value)}
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