import {
    CalendarDaysIcon,
    EnvelopeIcon,
    FaceSmileIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    MapIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    TrashIcon,
    UserCircleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type SubmitEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import MaleProfile from "../../assets/undraw_indie-hacker-avatar_b3wy.svg";
import ActionButton, {
    type ActionButtonProps,
} from "../../components/ActionButtonComponent";
import InputComponent from "../../components/form/InputComponent";
import SelectComponent from "../../components/form/SelectComponent";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import ModalComponent from "../../components/ModalComponent";
import DividerComponent from "../../components/nav/DividerComponent";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import usePagination from "../../components/pagination/usePagination";
import SpinnerComponent from "../../components/SpinnerComponent";
import usePrincipal, {
    RoleType,
    UserGender,
    type UserProfile,
} from "../../context/usePrincipal";
import { RoutePaths } from "../../routes/RoutePaths";
import UserService from "../../services/UserService";
import UserCard from "./UserCard";
import FemaleProfile from "/undraw_fitness-influencer-avatar_04j0.svg";

export default function UsersPage() {
    const navigate = useNavigate();

    const { profile } = usePrincipal();
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);

    const [newUser, setNewUser] = useState<UserProfile | null>(null);
    const [notifications, setNotifications] =
        useState<NotificationProps | null>(null);

    const refreshUsers = useCallback(() => {
        UserService.getAllUsers<UserProfile[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllUsers(resp.data.filter((u) => u.id != profile?.id));
            }
            setIsLoading(false);
        });
    }, [profile]);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const queryProfiles: UserProfile[] = useMemo(() => {
        if (!searchQuery.trim()) return allUsers;
        return allUsers.filter((user) => {
            user = { ...user, name: `${user.firstName} ${user.lastName}` };
            return (
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [searchQuery, allUsers]);

    const addNewUser = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...newUser,
            name: `${newUser?.firstName} ${newUser?.lastName}`,
            role: newUser?.roles[0],
        };

        UserService.createUser<UserProfile>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications({
                    type: "success",
                    messages: ["User created successfully"],
                });
                refreshUsers();
            } else {
                setNotifications({
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? [
                                  ...resp.validationErrors.map(
                                      (ve) => ve.field + " " + ve.message,
                                  ),
                              ]
                            : [resp.errorMessage],
                });
            }
        });
    };

    const deleteUser = useCallback(
        (id: unknown) => {
            UserService.deleteProfile<{ status: boolean }>(id as number).then(
                (resp) => {
                    if (resp && "errorMessage" in resp) {
                        window.alert(resp.errorMessage);
                    } else {
                        window.alert("User Deleted Successfully");
                    }
                    refreshUsers();
                },
            );
        },
        [refreshUsers],
    );

    const userCards = useMemo(() => {
        return queryProfiles.map((user) => ({
            id: user.id,
            dp:
                user.gender == UserGender.MALE
                    ? MaleProfile
                    : user.gender == UserGender.FEMALE
                      ? FemaleProfile
                      : "src/assets/undraw_deep-thinker-avatar_6xg6.svg",
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            role: user.roles[0],
            actionButtons: [
                {
                    text: "Edit",
                    icon: PencilIcon,
                    customise: "h-6",
                    customiseIcon: "size-4!",
                    onClick: () =>
                        navigate(RoutePaths.USER.replace(":userId", user.id)),
                },
                {
                    text: "Delete",
                    icon: TrashIcon,
                    customise: "h-6",
                    customiseIcon: "text-rose-400! size-4!",
                    onClick: deleteUser,
                },
            ] as ActionButtonProps[],
        }));
    }, [queryProfiles, navigate, deleteUser]);

    const pagination = usePagination(userCards, 8);

    return (
        <DashboardLayout>
            {[
                <DashboardSection
                    header={{
                        title: "Users",
                        description: "Manage Application Users",
                        actionElements: [
                            {
                                button: {
                                    icon: UserPlusIcon,
                                    text: "New User",
                                    theme: "primary-blur",
                                    onClick() {
                                        setModalOpen(true);
                                    },
                                },
                            },
                        ],
                    }}
                    pagination={pagination}
                    search={{
                        id: "userSearchFiled",
                        label: { icon: MagnifyingGlassIcon },
                        customise: "w-full md:w-2/4",
                        placeholder: "Search by email",
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                            setSearchQuery(e.target.value);
                        },
                    }}
                    spinner={{ isLoading }}
                >
                    {/* User Cards */}
                    <div className="space-y-3">
                        {isLoading ? (
                            <SpinnerComponent text="Fetching Users..." />
                        ) : pagination.currentItems.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {pagination.currentItems.map(
                                    (cardData, idx) => (
                                        <UserCard key={idx} card={cardData} />
                                    ),
                                )}
                            </div>
                        ) : (
                            <h3 className="text-base text-slate-900 dark:text-slate-100 capitalize">
                                {searchQuery != ""
                                    ? "0 Users found with given search query"
                                    : "No users to display except you there"}
                            </h3>
                        )}
                    </div>

                    {/* User Management Modal */}
                    <ModalComponent
                        title="Manage User"
                        maxWidthClass="max-w-2xl"
                        icon={UserPlusIcon}
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(!modalOpen)}
                    >
                        <form
                            onSubmit={addNewUser}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2"
                        >
                            {notifications && (
                                <Notification
                                    type={notifications.type}
                                    messages={notifications.messages}
                                />
                            )}
                            <DividerComponent
                                text="User Type"
                                customise="col-span-full"
                            />
                            <SelectComponent
                                id="userType"
                                emptyText={"Role"}
                                label={{ icon: GlobeAltIcon }}
                                options={Object.keys(RoleType).map((g) => ({
                                    text: g,
                                    value: g,
                                }))}
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                roles: [e.target.value],
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <DividerComponent
                                text="Info"
                                customise="col-span-full"
                            />
                            <InputComponent
                                id="firstName"
                                label={{ text: "FN", icon: UserCircleIcon }}
                                placeholder="First Name"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="lastName"
                                label={{ text: "LN", icon: UserCircleIcon }}
                                placeholder="Last Name"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="email"
                                type="email"
                                label={{ icon: EnvelopeIcon }}
                                placeholder="Email"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                email: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="phone"
                                type="number"
                                label={{ icon: PhoneIcon }}
                                onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                }
                                onKeyDown={(e) => {
                                    if (
                                        ["e", "E", "-", "+", ".", ","].includes(
                                            e.key,
                                        )
                                    )
                                        e.preventDefault();
                                }}
                                min={1}
                                step={1}
                                placeholder="Phone"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                phone: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="dob"
                                type="date"
                                label={{ icon: CalendarDaysIcon, text: "DOB" }}
                                placeholder="DOB"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                dob: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <SelectComponent
                                id="gender"
                                emptyText="Gender"
                                label={{ icon: FaceSmileIcon }}
                                options={Object.keys(UserGender).map((g) => ({
                                    text: g,
                                    value: g,
                                }))}
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                gender: e.target.value,
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <DividerComponent
                                text="Address"
                                customise="col-span-full"
                            />
                            <InputComponent
                                id="street"
                                label={{ icon: MapIcon }}
                                placeholder="Street"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                address: {
                                                    ...prev?.address,
                                                    street: e.target.value,
                                                },
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="pincode"
                                label={{ icon: MapPinIcon }}
                                placeholder="Pincode"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                address: {
                                                    ...prev?.address,
                                                    pincode: e.target.value,
                                                },
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="state"
                                label={{ icon: MapIcon }}
                                placeholder="State"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                address: {
                                                    ...prev?.address,
                                                    state: e.target.value,
                                                },
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <InputComponent
                                id="country"
                                label={{ icon: GlobeAltIcon }}
                                placeholder="Country"
                                onChange={(e) => {
                                    setNewUser(
                                        (prev) =>
                                            ({
                                                ...prev,
                                                address: {
                                                    ...prev?.address,
                                                    country: e.target.value,
                                                },
                                            }) as UserProfile,
                                    );
                                }}
                                required
                            />
                            <div className="col-span-full border-slate-200 dark:border-slate-800 w-full">
                                <ActionButton
                                    type="submit"
                                    icon={UserPlusIcon}
                                    text={"Create"}
                                    theme="primary"
                                    customise="w-fit ml-auto"
                                />
                            </div>
                        </form>
                    </ModalComponent>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
