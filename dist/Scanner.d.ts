/// <reference types="react" />
import "./Scanner.css";
export default function Scanner({ scanning, scanSuccess, }: {
    scanning: boolean;
    scanSuccess: (result: string) => void;
}): import("react").JSX.Element;
