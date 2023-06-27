/// <reference types="react" />
import "./Scanner.css";
export default function Scanner({ scanning, scanSuccess, className, }: {
    scanning: boolean;
    scanSuccess: (result: string) => void;
    className?: string;
}): import("react").JSX.Element;
