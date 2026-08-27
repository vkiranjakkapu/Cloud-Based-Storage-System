import type {
    OptionHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
} from "react";
import FieldComponent from "./FieldComponent";
import type { LabelComponentProps } from "./FieldLabelComponent";
import FieldLabelComponent from "./FieldLabelComponent";

interface SelectComponentProps extends SelectHTMLAttributes<HTMLSelectElement> {
    children?: ReactNode;
    id: string;
    options: OptionComponentProps[];
    customise?: string;
    customiseField?: string;
    label?: LabelComponentProps;
}

interface OptionComponentProps extends OptionHTMLAttributes<HTMLOptionElement> {
    value: string | number;
    text?: string;
}

export default function SelectComponent({
    children,
    id,
    options,
    customise,
    customiseField,
    label,
    ...props
}: SelectComponentProps) {
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
            <select
                id={id}
                className={`focus:outline-none focus:ring-0 p-1 flex-1 capitalize ${customiseField}`}
                {...props}
            >
                <option value="">select</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.text ?? opt.value}
                    </option>
                ))}
            </select>
            {children}
        </FieldComponent>
    );
}
