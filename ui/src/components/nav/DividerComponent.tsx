import type { IconProps } from "../Commons";
import IconComponent from "../IconComponent";

type DividerComponentProps = {
    text: string;
    icon?: IconProps;
    inline?: boolean;
    customise?: string;
};

export default function DividerComponent({
    text,
    icon: Icon,
    inline = false,
    customise,
}: DividerComponentProps) {
    return (
        <div className={`inline-flex items-center justify-between text-slate-500/60 dark:text-cool/40 w-full pointer-events-none ${customise}`}>
            <h2 className="inline-flex items-center justify-between gap-1 text-xs uppercase font-semibold">
                {Icon && inline && <Icon className="size-3.5" />}
                <span>{text}</span>
            </h2>
            {Icon && !inline && (
                <IconComponent
                    icon={Icon}
                    customise="size-6"
                    customiseIcon="size-4"
                    theme="secondary-blur"
                />
            )}
        </div>
    );
}
