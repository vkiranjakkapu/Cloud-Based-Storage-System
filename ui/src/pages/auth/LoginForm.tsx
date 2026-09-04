import { UserPlusIcon } from "@heroicons/react/16/solid";
import {
    ArrowRightCircleIcon,
    EnvelopeIcon,
    KeyIcon,
    LockClosedIcon,
    LockOpenIcon,
    PlusCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { useState, type SetStateAction, type SubmitEvent } from "react";
import type { ApiResponse } from "../../api/api";
import InputComponent from "../../components/form/InputComponent";
import IconComponent from "../../components/IconComponent";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import usePrincipal, {
    AuthStatus,
    type UserProfile,
} from "../../context/usePrincipal";
import type { LoginRequest } from "../../services/AuthService";
import AuthService from "../../services/AuthService";
import ActionButton from "../../components/ActionButtonComponent";

type AllNotifications = {
    login: NotificationProps;
    registration: NotificationProps;
};

export default function LoginForm() {
    const [loginForm, setLoginForm] = useState<boolean>(true);
    const { login, status } = usePrincipal();

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

    function handleSignIn(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            email: formData.get("email"),
            password: formData.get("password"),
        } as LoginRequest;

        login(payload).then((resp) => {
            if (resp && "errorMessage" in resp) {
                setNotifications("login", {
                    type: "error",
                    messages:
                        resp.validationErrors.length === 0
                            ? [resp.errorMessage]
                            : [
                                  ...resp.validationErrors.map(
                                      (vr) => vr.field + " " + vr.message,
                                  ),
                              ],
                });
            }
        });
    }

    function handleRegister(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        if (password != confirmPassword) {
            setNotifications("registration", {
                type: "error",
                messages: ["Two Passwords didn't match!"],
            });
            return;
        }

        const payload = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password,
            confirmPassword,
        };

        AuthService.register<ApiResponse<UserProfile>>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                login({
                    email: formData.get("email"),
                    password: formData.get("password"),
                } as LoginRequest);
            } else {
                setNotifications("registration", {
                    type: "error",
                    messages:
                        resp.validationErrors.length === 0
                            ? [resp.errorMessage]
                            : [
                                  ...resp.validationErrors.map(
                                      (vr) => vr.field + " " + vr.message,
                                  ),
                              ],
                });
            }
        });
    }

    if (loginForm) {
        return (
            <form onSubmit={handleSignIn} className="grid grid-cols-1 gap-3">
                <LoadingPortalComponent
                    isLoading={status === AuthStatus.INITIALIZING}
                />
                <h1 className="col-span-full font-semibold uppercase flex items-center gap-1">
                    <LockClosedIcon className="size-5" />
                    <span>Sign In</span>
                </h1>
                {notifications && notifications.login && (
                    <Notification
                        type={notifications.login.type}
                        messages={notifications.login.messages}
                    />
                )}
                <InputComponent
                    id="email"
                    type="email"
                    name="email"
                    label={{ icon: EnvelopeIcon }}
                    placeholder="Enter Email"
                    required
                />
                <InputComponent
                    id="password"
                    type="password"
                    name="password"
                    label={{ icon: KeyIcon }}
                    placeholder="Enter Password"
                    required
                />
                <ActionButton
                    type="submit"
                    icon={LockOpenIcon}
                    theme="primary"
                    text="Login"
                    customise="h-8 gap-2 w-full col-span-full"
                />
                <hr className="border-b border-slate-200 dark:border-cool/15" />
                <IconComponent
                    icon={PlusCircleIcon}
                    theme="secondary-blur"
                    text="Register"
                    customise="h-8 gap-2 w-full col-span-full"
                    onClick={() => setLoginForm(false)}
                />
            </form>
        );
    }
    return (
        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-3">
            <LoadingPortalComponent
                isLoading={status === AuthStatus.INITIALIZING}
            />
            <h1 className="col-span-full font-semibold uppercase flex items-center gap-1">
                <UserPlusIcon className="size-5" />
                <span>Register</span>
            </h1>
            {notifications && notifications.registration && (
                <Notification
                    type={notifications.registration.type}
                    messages={notifications.registration.messages}
                />
            )}
            <InputComponent
                id="firstName"
                type="text"
                name="firstName"
                label={{ icon: UserIcon }}
                placeholder="Enter Firstname"
                required
            />
            <InputComponent
                id="lastName"
                type="text"
                name="lastName"
                label={{ icon: UserIcon }}
                placeholder="Enter Lastname"
                required
            />
            <InputComponent
                id="email"
                type="email"
                name="email"
                label={{ icon: EnvelopeIcon }}
                placeholder="Enter Email"
                required
            />
            <InputComponent
                id="password"
                type="password"
                name="password"
                label={{ icon: KeyIcon }}
                placeholder="Enter Password"
                required
            />
            <InputComponent
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                label={{ icon: LockClosedIcon }}
                placeholder="Confirm Password"
                required
            />
            <ActionButton
                type="submit"
                icon={ArrowRightCircleIcon}
                theme="primary"
                text="Register"
                customise="h-8 gap-2 w-full col-span-full"
            />
            <hr className="border-b border-slate-200 dark:border-cool/15" />
            <IconComponent
                icon={LockClosedIcon}
                theme="secondary-blur"
                text="Login"
                customise="h-8 gap-2 w-full col-span-full"
                onClick={() => setLoginForm(true)}
            />
        </form>
    );
}
