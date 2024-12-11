import {Editor} from "./editor/Editor.tsx";

export type Props = object


export function App() {
    return <>
        <h1 className={"text-center font-medium text-2xl text-gray-800 mt-2.5"}>ChartToPdf</h1>
        <Editor />
    </>;
}
