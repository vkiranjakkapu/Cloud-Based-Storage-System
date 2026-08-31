import type { IconComponentProps } from "./IconComponent";
import IconComponent from "./IconComponent";

export type ActionButtonProps = IconComponentProps & {};

export default function ActionButton(props: ActionButtonProps) {
    return (
        <IconComponent
            type="button"
            customise="p-2 shadow-xs"
            customiseIcon="size-4"
            customiseText="font-bold! pl-1"
            theme="secondary-blur"
            {...props}
        />
    );
}
