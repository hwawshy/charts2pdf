import {App, Props} from "../component/App"
import { hydrateRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './index.css'

hydrateRoot(
    document.getElementById('app') as HTMLElement,
    <MantineProvider><App {...window.props as Props} /></MantineProvider>
);
