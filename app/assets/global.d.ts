interface Window {
    props: object
}

declare module '*.scss' {
    interface classNames {
        [className: string]: string,
    }

    const classNames: classNames;
    export = classNames;
}
