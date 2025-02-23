import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {JSX, useCallback, useContext, useEffect, useState} from 'react'
import {Button} from "@mantine/core";
import {MainContext} from "../../../context/MainContext.ts";
import DOMPurify from "isomorphic-dompurify";

type Props = {
    setPdfData: (data: string) => void,
    openModal: () => void
};

export default function SubmitPlugin({setPdfData, openModal}: Props): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {pdfGenerateUrl} = useContext(MainContext);

    const $updateHtml = useCallback(() => {
        setHtml(DOMPurify.sanitize(
            $generateHtmlFromNodes(editor, null),
            { USE_PROFILES: {html: true, svg: true, svgFilters: true} }
        ));
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                $updateHtml();
            });
        });
    }, [editor, $updateHtml]);

    const onClick = async () => {
        editor.setEditable(false);
        setLoading(true);

        try {
            const response = await fetch(pdfGenerateUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({html: html})
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}:${response.statusText}`);
            }

            const json = await response.json();
            setPdfData(json.content);
            openModal();
        } catch (e: unknown) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error(`Unknown error occurred: ${e}`);
            }
        } finally {
            editor.setEditable(true)
            setLoading(false);
        }
    };

    return <Button className={"absolute"} loading={loading} onClick={onClick}>Generate PDF</Button>;
}
