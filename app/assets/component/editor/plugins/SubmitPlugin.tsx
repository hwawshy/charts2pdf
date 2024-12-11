import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {JSX, useCallback, useEffect, useState} from 'react'
import {Button} from "@mantine/core";

export default function SubmitPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const $updateHtml = useCallback(() => {
        setHtml($generateHtmlFromNodes(editor, null));
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            editorState.read(() => {
                $updateHtml();
            });
        });
    });

    const onClick = async () => {
        console.log(html);
        editor.setEditable(false);
        setLoading(true);
        await fetch('http://localhost/generate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({html: html})
        });
        editor.setEditable(true)
        setLoading(false);
    };

    return <Button className={"absolute"} loading={loading} onClick={onClick}>Generate PDF</Button>;
}
