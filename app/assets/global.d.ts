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

declare module "*.svg" {
    import * as React from "react";

    const ReactComponent: React.FunctionComponent<
        React.ComponentProps<"svg"> & { title?: string, titleId?: string, desc?: string, descId?: string, className?: string }
    >;

    export default ReactComponent;
}
