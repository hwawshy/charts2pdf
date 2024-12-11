import ReactDOMServer from 'react-dom/server'
import {App, Props} from "../component/App";
import '@mantine/core/styles.css';
import './index.css'
import {StrictMode} from "react";
import {MantineProvider} from "@mantine/core";

export function render(props: Props) {
    return ReactDOMServer.renderToString(
        <StrictMode>
            <MantineProvider>
                <App {...props} />
            </MantineProvider>
        </StrictMode>
    )
}
