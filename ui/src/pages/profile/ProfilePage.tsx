import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import type { UserProfile } from "../../context/usePrincipal";
import AuthService from "../../services/AuthService";
import usePrincipal, { UserGender } from "../../context/usePrincipal";
import type { NotificationProps } from "../../components/Notification";
import {
    useEffect,
    useState,
    type SetStateAction,
    type SubmitEvent,
} from "react";
import { RoutePaths } from "../../routes/RoutePaths";
import Notification from "../../components/Notification";
import InputComponent from "../../components/form/InputComponent";
import {
    CalendarIcon,
    CheckBadgeIcon,
    EnvelopeIcon,
    FaceSmileIcon,
    KeyIcon,
    LockClosedIcon,
    LockOpenIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import SelectComponent from "../../components/form/SelectComponent";
import ActionButton from "../../components/ActionButtonComponent";
import DividerComponent from "../../components/nav/DividerComponent";

type AllNotifications = {
    profile: NotificationProps;
    password: NotificationProps;
};

export default function ProfilePage() {
    const navigate = useNavigate();
    const { profile, isAdmin } = usePrincipal();
    const { userId } = useParams<{ userId: string }>();

    const [fetchedUser, setFetchedUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!!userId);

    const user = userId ? fetchedUser : profile;

    const [notifications, updateNotifications] =
        useState<AllNotifications | null>({} as AllNotifications);

    function setNotifications<K extends keyof AllNotifications>(
        belongs: K,
        value: SetStateAction<NotificationProps>,
    ) {
        updateNotifications((prev) => {
            const current = prev ?? ({} as AllNotifications);

            const nextValue =
                typeof value === "function"
                    ? (
                          value as (
                              prevVal: NotificationProps,
                          ) => NotificationProps
                      )(current[belongs])
                    : value;

            return {
                ...current,
                [belongs]: nextValue,
            };
        });
    }

    useEffect(() => {
        if (!userId) return

        if (!isAdmin) {
            navigate(RoutePaths.PROFILE);
            return;
        }

        AuthService.getUserById<UserProfile>(userId)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setFetchedUser({
                        ...resp.data,
                        name: `${resp.data.firstName} ${resp.data.lastName}`,
                    });
                } else {
                    setNotifications("profile", {
                        type: "error",
                        messages: [resp.errorMessage],
                    });
                }
            })
            .finally(() => setIsLoading(false));
    }, [userId, isAdmin, navigate]);

    function handleProfileUpdate(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            ...user,
            name: formData.get("firstName") + " " + formData.get("lastName"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phone: formData.get("phone"),
            gender: formData.get("gender"),
            dob: formData.get("dob"),
        } as UserProfile;

        AuthService.updateProfile<UserProfile>(
            String(userId ?? profile?.id),
            payload,
        ).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFetchedUser({
                    ...resp.data,
                    name: `${resp.data.firstName} ${resp.data.lastName}`,
                });
                setNotifications("profile", {
                    type: "success",
                    messages: ["Profile updated successfully"],
                });
            } else {
                setNotifications("profile", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    }

    function handlePasswordChange(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const confirmPassword = formData.get("confirmPassword");
        const newPassword = formData.get("newPassword");

        if (newPassword !== confirmPassword) {
            setNotifications("password", {
                type: "error",
                messages: ["Passwords didn't matched!"],
            });
            return;
        }

        const payload = {
            email: user?.email,
            oldPassword: formData.get("oldPassword"),
            newPassword: formData.get("newPassword"),
        };
        AuthService.changePassword<UserProfile>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications("password", {
                    type: "success",
                    messages: ["Password updated successfully"],
                });
            } else {
                setNotifications("password", {
                    type: "error",
                    messages: resp.validationErrors
                        ? [...resp.validationErrors.map((ve) => ve.message)]
                        : [resp.errorMessage],
                });
            }
        });
    }
    return (
        <DashboardLayout>
            {[
                <DashboardSection
                    header={{
                        breadCrumbs:
                            !isLoading && userId
                                ? [
                                      {
                                          text: "Users",
                                          uri: RoutePaths.USERS,
                                      },
                                      {
                                          text: user?.name ?? "loading...",
                                          uri: RoutePaths.USER.replace(
                                              ":userId",
                                              userId,
                                          ),
                                      },
                                  ]
                                : [
                                      {
                                          text: "Profile",
                                          uri: RoutePaths.USERS,
                                      },
                                  ],
                        description:
                            userId && !isLoading
                                ? `You are Editing ${user?.name}'s Profile`
                                : "Edit Your Profile",
                    }}
                    spinner={{ isLoading, text: "Loading Profile..." }}
                >
                    <div className="flex flex-wrap gap-2 justify-center *:flex-1">
                        <form
                            key={user?.id ?? "loading"}
                            onSubmit={handleProfileUpdate}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <h1 className="col-span-full">
                                <DividerComponent
                                    text="Edit Profile"
                                    icon={UserIcon}
                                    inline
                                />
                            </h1>
                            {notifications?.profile && (
                                <div className="col-span-full">
                                    <Notification
                                        type={notifications.profile.type}
                                        messages={
                                            notifications.profile.messages
                                        }
                                    />
                                </div>
                            )}
                            <InputComponent
                                id="firstName"
                                label={{ icon: UserIcon, text: "First" }}
                                placeholder="enter firstname"
                                name="firstName"
                                defaultValue={user?.firstName ?? ""}
                                required
                            />
                            <InputComponent
                                id="lastName"
                                label={{ icon: UserIcon, text: "Last" }}
                                placeholder="enter lastname"
                                name="lastName"
                                defaultValue={user?.lastName ?? ""}
                                required
                            />
                            <InputComponent
                                id="email"
                                type="email"
                                label={{ icon: EnvelopeIcon }}
                                placeholder="enter email"
                                name="email"
                                defaultValue={user?.email ?? ""}
                                disabled
                                required
                            />
                            <InputComponent
                                id="phone"
                                label={{ icon: PhoneIcon }}
                                placeholder="enter phone"
                                name="phone"
                                defaultValue={user?.phone ?? ""}
                                required
                            />
                            <InputComponent
                                id="date"
                                type="date"
                                label={{ icon: CalendarIcon }}
                                placeholder="Date Of Birth"
                                name="dob"
                                defaultValue={user?.dob ?? ""}
                                required
                            />
                            <SelectComponent
                                id="userGender"
                                emptyText="Gender"
                                label={{ icon: FaceSmileIcon }}
                                options={Object.keys(UserGender).map((g) => ({
                                    text: g,
                                    value: g,
                                }))}
                                name="gender"
                                customise="bg-slate-50 dark:bg-slate-800 shadow-sm cursor-pointer"
                                defaultValue={user?.gender ?? ""}
                                required
                            />
                            <div className="col-span-full text-end">
                                <ActionButton
                                    text="Update"
                                    type="submit"
                                    icon={CheckBadgeIcon}
                                    theme="primary"
                                />
                            </div>
                        </form>
                        {!userId && (
                            <>
                                <form
                                    onSubmit={handlePasswordChange}
                                    className="grid grid-cols-1 gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    <DividerComponent text="OLD Password" icon={LockClosedIcon} inline customise="col-span-full" />
                                    {notifications?.password && (
                                        <div className="col-span-full">
                                            <Notification
                                                type={
                                                    notifications.password.type
                                                }
                                                messages={
                                                    notifications.password
                                                        .messages
                                                }
                                            />
                                        </div>
                                    )}
                                    <InputComponent
                                        id="currentPass"
                                        label={{ icon: LockOpenIcon }}
                                        placeholder="Authenticate"
                                        name="oldPassword"
                                        required
                                    />
                                    <div className=""></div>
                                    <DividerComponent text="new Password" icon={LockClosedIcon} inline customise="col-span-full" />
                                    <InputComponent
                                        type="password"
                                        id="newPassword"
                                        label={{ icon: LockClosedIcon }}
                                        placeholder="New password"
                                        name="newPassword"
                                        onChange={(e) => {
                                            const confirmPass =
                                                document.getElementById(
                                                    "confirmPassword",
                                                ) as HTMLInputElement;
                                            if (
                                                e.target.value !== "" &&
                                                confirmPass.value !==
                                                    e.target.value
                                            ) {
                                                setNotifications("password", {
                                                    type: "error",
                                                    messages: [
                                                        "Two Passwords didn't matched!",
                                                    ],
                                                });
                                            } else {
                                                setNotifications("password", {
                                                    type: "error",
                                                    messages: [],
                                                });
                                            }
                                        }}
                                        required
                                    />
                                    <InputComponent
                                        type="password"
                                        id="confirmPassword"
                                        label={{ icon: LockClosedIcon }}
                                        placeholder="Confirm password"
                                        name="confirmPassword"
                                        onChange={(e) => {
                                            const newPass =
                                                document.getElementById(
                                                    "newPassword",
                                                ) as HTMLInputElement;
                                            if (
                                                e.target.value !== "" &&
                                                newPass.value !== e.target.value
                                            ) {
                                                setNotifications("password", {
                                                    type: "error",
                                                    messages: [
                                                        "Two Passwords didn't matched!",
                                                    ],
                                                });
                                            } else {
                                                setNotifications("password", {
                                                    type: "error",
                                                    messages: [],
                                                });
                                            }
                                        }}
                                        required
                                    />
                                    <div className="col-span-full">
                                        <ActionButton
                                            type="submit"
                                            text="Change"
                                            icon={KeyIcon}
                                            theme="primary"
                                            customise="w-fit ml-auto"
                                        />
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
