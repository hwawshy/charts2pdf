import {Editor} from "./editor/Editor.tsx";
import Logo from '../icons/logo.svg';
import {MainContext} from "../context/MainContext.ts";

export type Props = {
    pdfGenerateUrl: string;
};


export function App({pdfGenerateUrl}: Props) {
    return <MainContext.Provider value={{pdfGenerateUrl}}>
        <Logo className={'mx-auto w-[300px]'} />
        <Editor />
    </MainContext.Provider>;
}
