import type { InputHTMLAttributes, ReactNode } from "react";
import FieldComponent from "./FieldComponent";
import type { LabelComponentProps } from "./FieldLabelComponent";
import FieldLabelComponent from "./FieldLabelComponent";

export type InputComponentProps = InputHTMLAttributes<HTMLInputElement> & {
    children?: ReactNode;
    id: string;
    customise?: string;
    customiseInput?: string;
    label?: LabelComponentProps;
};

export default function InputComponent({
    children,
    id: id,
    customise,
    customiseInput,
    label,
    ...props
}: InputComponentProps) {
    return (
        <FieldComponent customise={customise}>
            {label && (
                <FieldLabelComponent
                    {...{
                        htmlFor: id,
                        ...label,
                    }}
                />
            )}
            <input
                id={id}
                className={`focus:outline-none focus:ring-0 p-1 flex-1 ${customiseInput}`}
                {...props}
            />
            {children}
        </FieldComponent>
    );
}
