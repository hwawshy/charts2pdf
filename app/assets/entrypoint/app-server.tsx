import ReactDOMServer from 'react-dom/server'
import {App, Props} from "../component/App";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './index.css'

export function render(props: Props) {
    return ReactDOMServer.renderToString(
        <MantineProvider><App {...props} /></MantineProvider>
    )
}
