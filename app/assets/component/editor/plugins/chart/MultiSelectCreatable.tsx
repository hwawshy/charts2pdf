import {useState} from 'react';
import {Combobox, Pill, PillsInput, useCombobox } from '@mantine/core';

export function MultiSelectCreatable({values, onValuesChange}: {values: string[], onValuesChange: (values: string[]) => void}) {
    const combobox = useCombobox();

    const [search, setSearch] = useState('');

    const handleValueSelect = () => {
        onValuesChange([...values, search.trim()]);
        setSearch('');
    };

    const handleValueRemove = (val: string) =>
        onValuesChange(values.filter((v) => v !== val));

    const pills = values.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <PillsInput>
                <Pill.Group>
                    {pills}
                    <Combobox.EventsTarget>
                        <PillsInput.Field
                            value={search}
                            placeholder="Enter a label"
                            onChange={(event) => {
                                setSearch(event.currentTarget.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Backspace' && search.length === 0) {
                                    event.preventDefault();
                                    handleValueRemove(values[values.length - 1]);
                                }

                                if (event.key === 'Enter' && search.trim().length > 0) {
                                    event.preventDefault();
                                    handleValueSelect()
                                }
                            }}
                        />
                    </Combobox.EventsTarget>
                </Pill.Group>
            </PillsInput>

            <Combobox.Options>
                {search.trim().length > 0 && (
                    <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
                )}
            </Combobox.Options>
        </Combobox>
    );
}