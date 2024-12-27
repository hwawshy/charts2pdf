import {Box, Button, Modal} from "@mantine/core";
import {JSX} from "react";

type Props = {
    opened: boolean,
    close: () => void,
    pdfData: string | null
};

export function SuccessModal({opened, close, pdfData}: Props): JSX.Element {
    const dataURL = `data:application/pdf;base64,${pdfData}`;

    return <Modal opened={opened} onClose={close} centered size={'80%'}>
        {pdfData &&
            <Box className={'flex flex-col items-center gap-2.5'}>
                <span className={"text-2xl"}>Your PDF document is ready</span>
                <Button><a href={dataURL} download={'result.pdf'}>Download</a></Button>
                <object className={"h-[100vh] w-full"} type="application/pdf" data={dataURL}></object>
            </Box>
        }
    </Modal>;
}
