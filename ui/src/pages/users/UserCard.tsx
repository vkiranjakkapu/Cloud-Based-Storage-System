import type { ActionButtonProps } from "../../components/ActionButtonComponent";
import ActionButton from "../../components/ActionButtonComponent";

export type UserCardData = {
    id: string;
    dp: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    actionButtons: ActionButtonProps[];
    roles?: string;
};
type UserCardProps = {
    card: UserCardData;
};

export default function UserCard({ card }: UserCardProps) {
    return (
        <div className="userCard flex items-center justify-center gap-2 p-2 py-3 bg-white dark:bg-secondary-dark rounded-md shadow-sm border border-slate-200 dark:border-cool/15">
            <img src={card.dp} alt={card.email} className="size-20" />
            <div className="space-y-1 text-sm min-w-0">
                <p className="rounded-full text-xs bg-warm/50 dark:bg-cool/50 font-semibold text-primary dark:text-secondary-dark w-fit p-0.5 px-1.5">
                    {card.role}
                </p>
                <p className="break-all">{card.name}</p>
                <p className="text-xs truncate" title={card.email}>
                    {card.email}
                </p>
                <div className="inline-flex gap-2 justify-between">
                    <p>{card.phone}</p>
                </div>
                <div className="flex justify-start gap-2 p-1 dark:bg-cool/15 w-fit rounded-md">
                    {card.actionButtons.map((btn, idx) => {
                        return <ActionButton key={idx} {...btn} />;
                    })}
                </div>
            </div>
        </div>
    );
}
