import {Editor} from "./editor/Editor.tsx";
import Logo from '../icons/logo.svg';

export type Props = object


export function App() {
    return <>
        <Logo className={'mx-auto w-[300px]'} />
        <Editor />
    </>;
}
