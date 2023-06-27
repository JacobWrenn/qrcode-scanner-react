import "./Scanner.css";
export default function Scanner({ scanning, scanSuccess, }: {
    scanning: boolean;
    scanSuccess: (result: string) => void;
}): import("react/jsx-runtime").JSX.Element;
