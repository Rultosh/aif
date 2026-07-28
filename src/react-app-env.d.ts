/// <reference types="react-scripts" />

declare module "*.mp4" {
    const src: string;
    export default src;
}
declare module "*.pdf" {
    const src: string;
    export default src;
}

declare module "react-pdf" {
    import { ComponentType, ReactElement, ReactNode } from "react";

    export const pdfjs: {
        version: string;
        GlobalWorkerOptions: { workerSrc: string };
    };

    export type DocumentProps = {
        file: string | File | Blob | ArrayBuffer | { url?: string } | null;
        loading?: ReactElement | string;
        onLoadSuccess?: (pdf: { numPages: number }) => void;
        onLoadError?: (error: Error) => void;
        children?: ReactNode;
    };

    export type PageProps = {
        pageNumber: number;
        width?: number;
        renderTextLayer?: boolean;
        renderAnnotationLayer?: boolean;
        onLoadSuccess?: (page: unknown) => void;
        onRenderSuccess?: (page: unknown) => void;
        onRenderError?: (error: Error) => void;
    };

    export const Document: ComponentType<DocumentProps>;
    export const Page: ComponentType<PageProps>;
}
