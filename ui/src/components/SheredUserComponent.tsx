import { UsersIcon } from "@heroicons/react/24/outline";
import Avatar from "/undraw_designer-avatar_n5q8.svg";

type SharedUserComponentProps = {
    isPublic?: boolean;
};

export default function SharedUserComponent({
    isPublic = true,
}: SharedUserComponentProps) {
    return (
        <div className="flex items-center gap-2 px-2 py-1 rounded-md shadow-sm bg-slate-50 dark:bg-secondary-dark border border-slate-200 dark:border-cool/15">
            {isPublic ? (
                <UsersIcon className="size-9 p-2 rounded-full bg-slate-200 dark:bg-white/20 shadow-sm" />
            ) : (
                <img
                    src={Avatar}
                    alt="Avatar"
                    className="size-9 rounded-full border-slate-200 shadow-sm p-1"
                />
            )}
            <div className="flex-1 -space-y-0.5">
                <p>{isPublic ? "Public" : "Venkata Kiran J"}</p>
                <p className="opacity-70">Editor</p>
            </div>
        </div>
    );
}
