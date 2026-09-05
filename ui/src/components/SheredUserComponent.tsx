import { UsersIcon } from "@heroicons/react/24/outline";
import MaleProfile from "../assets/undraw_indie-hacker-avatar_b3wy.svg";
import { UserGender, type UserProfile } from "../context/usePrincipal";
import FloatingMenuComponent, {
    type FloatingMenuComponentProps,
} from "./floatingMenu/FloatingMenuComponent";
import FemaleProfile from "/undraw_fitness-influencer-avatar_04j0.svg";
import type { AccessRecord } from "../services/ShareService";
import type { SharedFile } from "../services/FileService";
import { DateFormatter } from "../utils/DateFormatter";

type SharedUserComponentProps = {
    user?: UserProfile;
    share?: SharedFile;
    isPublic?: boolean;
    dropDown?: FloatingMenuComponentProps<AccessRecord>;
};

export default function SharedUserComponent({
    user,
    share,
    isPublic = false,
    dropDown,
}: SharedUserComponentProps) {
    const dp =
        user?.gender == UserGender.MALE
            ? MaleProfile
            : user?.gender == UserGender.FEMALE
              ? FemaleProfile
              : "./undraw_designer-avatar_n5q8.svg";
    return (
        <>
            {(isPublic || user != undefined) && (
                <div className="flex items-center gap-2 px-2 py-1 rounded-md shadow-sm bg-slate-50 dark:bg-secondary-dark border border-slate-200 dark:border-cool/15">
                    {isPublic ? (
                        <UsersIcon className="size-9 p-2 rounded-full bg-slate-200 dark:bg-white/20 shadow-sm" />
                    ) : (
                        <img
                            src={dp}
                            alt="Avatar"
                            className="size-9 rounded-full border-slate-200 shadow-sm p-1"
                        />
                    )}
                    <div className="flex-1 -space-y-0.5">
                        <p>
                            {isPublic
                                ? "Public"
                                : user &&
                                  user?.firstName + " " + user?.lastName}
                        </p>
                        {share && (
                            <p>{`Expires on : ${DateFormatter.toFormattedDate(share?.expiry)}`}</p>
                        )}
                    </div>
                    {dropDown && (
                        <div className="">
                            <FloatingMenuComponent {...dropDown} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
