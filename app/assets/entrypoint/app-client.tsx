import {App, Props} from "../component/App"
import { hydrateRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './index.css'
import {StrictMode} from "react";

hydrateRoot(
    document.getElementById('app') as HTMLElement,
    <StrictMode><MantineProvider><App {...window.props as Props} /></MantineProvider></StrictMode>
);
