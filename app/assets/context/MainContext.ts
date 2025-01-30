import { createContext } from 'react';

type MainContextValue = {
    pdfGenerateUrl: string
};

export const MainContext = createContext<MainContextValue>({} as MainContextValue)
