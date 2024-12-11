import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {TreeView} from '@lexical/react/LexicalTreeView';

export default function TreeViewPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    return (
        <TreeView
            viewClassName="block bg-[#222] text-white p-[5px] text-[12px] whitespace-pre-wrap mx-auto mt-[1px] mb-2.5 max-h-64 relative rounded-b-[10px] overflow-auto leading-[14px]"
            treeTypeButtonClassName="hover:underline"
            timeTravelPanelClassName="overflow-hidden px-0 py-0 pb-2.5 mx-auto my-auto flex"
            timeTravelButtonClassName="border-0 p-0 text-[12px] top-2.5 right-[15px] absolute bg-none text-white hover:underline"
            timeTravelPanelSliderClassName="p-0 grow-[8]"
            timeTravelPanelButtonClassName="p-0 border-0 grow bg-none text-white text-[12px] hover:underline"
            editor={editor}
        />
    );
}