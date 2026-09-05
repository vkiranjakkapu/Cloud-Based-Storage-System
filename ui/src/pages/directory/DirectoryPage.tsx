import {
    ArrowRightCircleIcon,
    ArrowRightIcon,
    ArrowUpTrayIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    FolderOpenIcon,
    FolderPlusIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusCircleIcon,
    ShareIcon,
    TrashIcon,
    UserIcon,
    UserMinusIcon,
    UserPlusIcon,
    ViewColumnsIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type ReactNode,
    type SetStateAction,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "../../components/ActionButtonComponent";
import FileListComponent from "../../components/directories/FileListComponent";
import { FolderComponent } from "../../components/directories/FolderComponent";
import type { FloatingMenuComponentProps } from "../../components/floatingMenu/FloatingMenuComponent";
import InputComponent from "../../components/form/InputComponent";
import IconComponent from "../../components/IconComponent";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import IconHeaderLayout from "../../components/layouts/IconHeaderLayout";
import ModalComponent from "../../components/ModalComponent";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import Notification, {
    type NotificationProps,
} from "../../components/Notification";
import SharedUserComponent from "../../components/SheredUserComponent";
import {
    UploadComponent,
    type UploadComponentProps,
} from "../../components/UploadComponent";
import type { UserProfile } from "../../context/usePrincipal";
import { RoutePaths } from "../../routes/RoutePaths";
import DirectoryService, {
    UpdateType,
    type DirectoryResponse,
    type Folder,
    type TreeResponseDto,
    type UpdateFolderRequest,
} from "../../services/DirectoryService";
import type {
    LatestFiles,
    MetaFile,
    SharedFile,
} from "../../services/FileService";
import FileService from "../../services/FileService";
import ShareService, { type AccessRecord } from "../../services/ShareService";
import UploadService, {
    type UploadRequest,
} from "../../services/UploadService";
import UserService from "../../services/UserService";
import { DateFormatter } from "../../utils/DateFormatter";
import { formatBytes } from "../../utils/FileUploadHelper";
import FilesList from "./FilesList";
import usePrincipal from "../../context/usePrincipal";

type AllNotifications = {
    add: NotificationProps;
    rename: NotificationProps;
    move: NotificationProps;
    share: NotificationProps;
    emailSearch: NotificationProps;
};

export default function DirectoryPage() {
    const { folderId: directoryId } = useParams<{
        folderId: string;
        fileId: string;
    }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    const { profile } = usePrincipal();

    // ? Directory Fetching
    const [directory, setDirectory] = useState<DirectoryResponse | null>(null);
    const [folderTree, setFolderTree] = useState<TreeResponseDto | null>(null);

    const [latestFiles, setLatestFiles] = useState<LatestFiles[]>([]);
    const refreshLatestFiles = useCallback(() => {
        FileService.getLatestFiles<LatestFiles[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setLatestFiles(resp.data);
            }
        });
    }, []);

    const refreshDirectory = useCallback(() => {
        DirectoryService.getDirectoryContents<DirectoryResponse>(directoryId)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setDirectory(resp.data);
                } else {
                    if (resp.errorCode === "BUS-2004") {
                        navigate(RoutePaths.DIRECTORY);
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [directoryId, navigate]);

    const refreshRootTree = useCallback(() => {
        DirectoryService.getFolderTree<TreeResponseDto>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFolderTree(resp.data);
            }
        });
    }, []);

    useEffect(() => {
        refreshDirectory();
        refreshRootTree();
    }, [refreshDirectory, refreshRootTree]);

    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // ? Modal
    const [folderModal, setFolderModal] = useState<"add" | "edit" | null>(null);
    const [fileModal, setFileModal] = useState<"add" | "edit" | "share" | null>(
        null,
    );
    const [shareItem, setShareItem] = useState<{
        file?: MetaFile;
        folder?: Folder;
    } | null>(null);

    // ? Notifications
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

    // ? Folder Handling
    const [activeFolder, setActiveFolder] = useState<Folder | null>(null);

    const addFolder = (folderName: string) => {
        updateNotifications(null);
        DirectoryService.addFolder<Folder>({
            folderName,
            parentId: directory?.parentFolders.toReversed()[0].id,
        }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications("add", {
                    type: "success",
                    messages: ["Folder created successfully."],
                });
                refreshDirectory();
            } else {
                setNotifications("add", {
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? resp.validationErrors.map(
                                  (ve) => ve.field + " " + ve.message,
                              )
                            : [resp.errorMessage],
                });
            }
        });
    };

    const renameFolder = (id: string, name: string) => {
        updateNotifications(null);
        DirectoryService.updateFolder<Folder>({
            id,
            name,
            type: UpdateType.RENAME,
        } as UpdateFolderRequest).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                refreshDirectory();
                refreshRootTree();
                setNotifications("rename", {
                    type: "success",
                    messages: ["Folder renamed successfully."],
                });
            } else {
                setNotifications("rename", {
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? resp.validationErrors.map(
                                  (ve) => ve.field + " " + ve.message,
                              )
                            : [resp.errorMessage],
                });
            }
        });
    };

    const moveFolder = () => {
        updateNotifications(null);
        if (
            directory?.parentFolders.map((f) => f.name).join("/") ===
            targetFolder?.path
        ) {
            setNotifications("move", {
                type: "info",
                messages: ["You are moving into same folder?"],
            });
            return;
        }
        const payload = {
            id: activeFolder?.id,
            targetId: targetFolder?.id,
            type: UpdateType.MOVE,
        } as UpdateFolderRequest;

        DirectoryService.updateFolder<Folder>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                refreshDirectory();
                setNotifications("move", {
                    type: "success",
                    messages: ["Folder moved successfully."],
                });
                const timeout = setTimeout(() => {
                    setFolderModal(null);
                    setActiveFolder(null);
                }, 5000);

                return clearTimeout(timeout);
            } else {
                setNotifications("move", {
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? resp.validationErrors.map(
                                  (ve) => ve.field + " " + ve.message,
                              )
                            : [resp.errorMessage],
                });
            }
        });
    };

    const deleteFolder = (folder: Folder) => {
        if (
            window.confirm(
                "Are you Sure you want to deleted this folder (" +
                    folder.name +
                    ")?",
            )
        ) {
            DirectoryService.deleteFolder<boolean>(folder?.id + "").then(
                (resp) => {
                    if (resp && !("errorMessage" in resp)) {
                        window.alert(
                            `'${folder.name}' has been deleted successfully.`,
                        );
                        refreshDirectory();
                        refreshRootTree();
                    } else {
                        window.alert(
                            "delete failed with error: " + resp.errorMessage,
                        );
                    }
                },
            );
        }
    };

    // ? File Handling
    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);

    const handleOpenFile = (file: MetaFile) => {
        setActiveFile(file);
        window.open(
            RoutePaths.FILE.replace(":folderId", file.folder.id).replace(
                ":fileId",
                file.id,
            ),
            "_blank",
        );
    };

    const fetchFileVersions = useCallback((file: MetaFile) => {
        FileService.getFileVersions<MetaFile[]>(file.id).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFileVersions(resp.data);
            }
        });
    }, []);
    useEffect(() => {
        refreshLatestFiles();
    }, [refreshLatestFiles]);

    const [fileVersions, setFileVersions] = useState<MetaFile[] | null>(null);
    const [sharedRecords, setSharedRecords] = useState<AccessRecord[] | null>(
        null,
    );

    const fetchSharedUsers = useCallback(
        (file: MetaFile) => {
            ShareService.getSharedWithUsers<AccessRecord[]>(file.id).then(
                (resp) => {
                    if (resp && !("errorMessage" in resp)) {
                        setSharedRecords(
                            resp.data
                                .filter((rec) => rec.user.id != profile?.id)
                                .map((rec) => {
                                    return {
                                        ...rec,
                                        user: {
                                            ...rec.user,
                                            name: `${rec.user.firstName} ${rec.user.lastName}`,
                                        },
                                    };
                                }),
                        );
                    }
                },
            );
        },
        [profile?.id],
    );

    const handleFileInfoClick = (file: MetaFile, isSharedFile?: boolean) => {
        if (isSharedFile) {
            const sharedFile = latestFiles
                .filter((item) => item.file.id === file.id)
                .at(0);
            file.owner = sharedFile?.owner;
        }
        setActiveFile(file);
        fetchFileVersions(file);
        fetchSharedUsers(file);
    };

    const renameFile = (id: string, name: string) => {
        updateNotifications(null);
        FileService.updateFile<MetaFile>({
            id,
            name,
            type: UpdateType.RENAME,
        }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications("rename", {
                    type: "success",
                    messages: ["File Renamed Successfully"],
                });
            } else {
                setNotifications("rename", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    };

    const moveFile = () => {
        updateNotifications(null);
        if (
            directory?.parentFolders.map((f) => f.name).join("/") ===
            targetFolder?.path
        ) {
            setNotifications("move", {
                type: "info",
                messages: ["You are moving into same folder?"],
            });
            return;
        }

        const payload = {
            id: activeFile?.id,
            targetId: targetFolder?.id,
            type: UpdateType.MOVE,
        } as UpdateFolderRequest;

        FileService.updateFile<MetaFile>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                refreshDirectory();
                setNotifications("move", {
                    type: "success",
                    messages: ["File moved successfully."],
                });
                const timeout = setTimeout(() => {
                    setFolderModal(null);
                    setActiveFolder(null);
                }, 5000);

                return clearTimeout(timeout);
            } else {
                setNotifications("move", {
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? resp.validationErrors.map(
                                  (ve) => ve.field + " " + ve.message,
                              )
                            : [resp.errorMessage],
                });
            }
        });
    };

    const handleShareFileClick = (file: MetaFile) => {
        setShareItem({ file });
        setFileModal("share");
    };
    const [searchEmail, setSearchEmail] = useState("");
    const [searchInProgress, setSearchInProgress] = useState(false);
    const [emailResults, setEmailResults] = useState<UserProfile[]>([]);

    const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);

    const fetchUsersByEmail = useCallback(() => {
        if (!searchEmail.trim()) {
            setEmailResults([]);
            return;
        }

        setSearchInProgress(true);

        UserService.getUsersByEmail<UserProfile[]>(searchEmail.trim())
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setEmailResults(resp.data);
                } else {
                    setEmailResults([]);

                    setNotifications("emailSearch", {
                        type: "error",
                        messages:
                            resp.validationErrors?.length > 0
                                ? resp.validationErrors.map(
                                      (ve) => ve.field + " " + ve.message,
                                  )
                                : [resp.errorMessage],
                    });
                }
            })
            .finally(() => {
                setSearchInProgress(false);
            });
    }, [searchEmail]);

    function addSelectedUser(user: UserProfile) {
        setSelectedUsers((prev) => {
            if (prev.some((selected) => selected.id === user.id)) {
                return prev;
            }

            return [...prev, user];
        });
    }

    function removeSelectedUser(userId: string) {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    }

    function shareFile() {
        const expiry = (
            document.getElementById("FileShareExpiryDate") as HTMLInputElement
        ).value;

        if (expiry == "") {
            setNotifications("share", {
                type: "info",
                messages: ["Please select the expiry time as well."],
            });
            return;
        }

        const payload = {
            fileId: shareItem?.file?.id,
            users: selectedUsers.map((user) => ({
                userId: user.id,
                email: user.email,
            })),
            expiry,
        };

        ShareService.shareFileWithUserIds<{
            shares: SharedFile[];
            info: string[];
        }>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                if (resp.data.info.length !== 0) {
                    setNotifications("share", {
                        type: "success",
                        messages: resp.data.info,
                    });
                    setEmailResults([]);
                    setSelectedUsers([]);
                } else
                    setNotifications("share", {
                        type: "success",
                        messages: [`File has been shared successfully.`],
                    });
            } else {
                setNotifications("share", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    }

    function removeFileAccess(access: AccessRecord) {
        if (window.confirm("Rmove File Access for " + access.user.name + "?")) {
            ShareService.removeAccess(access.share.id).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    window.alert("File Access Removed for " + access.user.name);
                }
                fetchSharedUsers(activeFile!);
            });
        }
    }

    const deleteFile = (file: MetaFile) => {
        setActiveFile(file);
        if (
            window.confirm(
                "Are you Sure you want to deleted " + file.fileName + "?",
            )
        ) {
            FileService.deleteFile<boolean>(file.id).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    refreshDirectory();
                    refreshRootTree();
                } else {
                    window.alert(
                        "delete failed with error: " + resp.errorMessage,
                    );
                }
            });
        }
    };

    // ? Upload Files
    const [uploadItems, setUploadItems] = useState<UploadComponentProps[]>([]);
    const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFileList = Array.from(e.target.files);

        const initialItems: UploadComponentProps[] = selectedFileList.map(
            (file) => ({
                file,
                progress: { loaded: 0, total: file.size, percentage: 0 },
                status: "uploading",
                controller: new AbortController(),
            }),
        );

        setUploadItems(initialItems);

        const uploadPromises = initialItems.map((item) =>
            UploadService.uploadFile<MetaFile>(
                { file: item.file, folderId: directoryId } as UploadRequest,
                (progress) => {
                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? { ...upItem, progress }
                                : upItem,
                        ),
                    );
                },
                item.controller?.signal,
            )
                .then((resp) => {
                    const isError = !resp || "errorMessage" in resp;
                    const errorMessage = isError
                        ? (resp as { errorMessage?: string })?.errorMessage ||
                          "Upload failed"
                        : undefined;

                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? {
                                      ...upItem,
                                      status: isError ? "error" : "success",
                                      error: errorMessage,
                                  }
                                : upItem,
                        ),
                    );
                    if (!isError) {
                        refreshDirectory();
                        refreshLatestFiles();
                    }
                })
                .catch((err) => {
                    if (err?.name === "CanceledError" || axios.isCancel(err))
                        return;

                    setUploadItems((prev) =>
                        prev.map((upItem) =>
                            upItem.file === item.file
                                ? {
                                      ...upItem,
                                      status: "error",
                                      error:
                                          err?.response?.data?.message ||
                                          err?.message ||
                                          "Upload failed",
                                  }
                                : upItem,
                        ),
                    );
                }),
        );

        await Promise.allSettled(uploadPromises);
    };

    const handleCancelUpload = (fileToCancel: File) => {
        setUploadItems((prevItems) => {
            const itemToCancel = prevItems.find(
                (item) => item.file === fileToCancel,
            );

            // Abort the active HTTP connection
            itemToCancel?.controller?.abort();

            return prevItems.filter((item) => item.file !== fileToCancel);
        });
    };

    // ? Sidebar
    function FileInfoSidebar(): ReactNode {
        return (
            <div className="space-y-2">
                <div className="relative bg-slate-50 dark:bg-secondary-dark w-full h-40 border border-slate-200 dark:border-cool/15 p-2 rounded-md shadow-sm">
                    <div className="relative h-full">
                        <DocumentTextIcon className="w-full h-full" />
                    </div>
                    <div className="absolute inset-0 flex justify-end text-end">
                        <div className="ml-auto p-2">
                            <IconComponent
                                icon={ShareIcon}
                                onClick={() => {
                                    setShareItem({ file: activeFile! });
                                    setFileModal("share");
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="">
                    <DividerComponent text="File info" />
                    <div className="p-2 bg-slate-50 dark:bg-secondary-dark rounded-md shadow-sm border border-slate-200 dark:border-cool/15">
                        <p
                            title={activeFile?.fileName}
                            className="max-w-[30ch] truncate"
                        >
                            {activeFile?.fileName}
                        </p>
                        <p>File Type: {activeFile?.mimeType.split("/")[1]}</p>
                        <p>Size: {formatBytes(activeFile?.fileSize ?? 0)}</p>
                        <p>
                            Uploaded:{" "}
                            {DateFormatter.toFormattedDate(
                                activeFile?.createdAt,
                            )}
                        </p>
                        {activeFile?.owner && (
                            <p>{`Owner: ${activeFile?.owner?.firstName} ${activeFile?.owner?.lastName}`}</p>
                        )}
                    </div>
                </div>
                {fileVersions && fileVersions.length > 1 && (
                    <div className="">
                        <DividerComponent text="Previous Versions" />
                        <div className="space-y-1">
                            {fileVersions?.slice(1, -1).map((version, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        className="p-1 px-2 bg-slate-50 dark:bg-secondary-dark border border-slate-200 dark:border-cool/15 rounded-md shadow-sm"
                                    >
                                        <p className="max-w-[30ch] truncate">
                                            {version.fileName}
                                        </p>
                                        <div className="flex items-center flex-wrap text-sm gap-2">
                                            <span>
                                                {DateFormatter.toFormattedDate(
                                                    version.createdAt,
                                                )}
                                            </span>
                                            <span>
                                                ({formatBytes(version.fileSize)}
                                                )
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {sharedRecords && sharedRecords.length > 0 && (
                    <>
                        <DividerComponent text="Shared With" />
                        {sharedRecords.map((record) => {
                            return (
                                <div className="" key={record.share.id}>
                                    <SharedUserComponent
                                        user={record.user}
                                        share={record.share}
                                        dropDown={{
                                            type: "icon",
                                            items: [
                                                {
                                                    icon: {
                                                        icon: UserMinusIcon,
                                                    },
                                                    onClick() {
                                                        removeFileAccess(
                                                            record,
                                                        );
                                                    },
                                                },
                                            ],
                                            alignment: "left",
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </>
                )}
                {activeFile?.owner && (
                    <div className="">
                        <DividerComponent text="Shared With you By" />
                        <SharedUserComponent user={activeFile.owner} />
                    </div>
                )}
            </div>
        );
    }

    const [targetFolder, setTargetFolder] = useState<{
        id: string;
        path: string;
    } | null>(null);

    const FolderTree = ({
        tree,
        disabled = false,
        path = "",
        movingFolder = false,
    }: {
        tree: TreeResponseDto;
        disabled?: boolean;
        path?: string;
        movingFolder?: boolean;
    }) => {
        const sourceFolderId = movingFolder
            ? activeFolder?.id
            : directory?.current.id;

        const isSource = sourceFolderId === tree.parent.id;

        const isDisabled = disabled || isSource;

        const currentPath = path
            ? `${path}/${tree.parent.name}`
            : tree.parent.name;

        const isSelected = targetFolder?.id === tree.parent.id;

        return (
            <li className="space-y-1">
                <div
                    className={`flex items-center space-x-1 ${
                        isDisabled ? "opacity-60" : ""
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();

                        if (!isDisabled) {
                            setTargetFolder({
                                id: tree.parent.id,
                                path: currentPath,
                            });
                        }
                    }}
                >
                    <input
                        type="radio"
                        name="folderChangeRadio"
                        id={tree.parent.id}
                        value={tree.parent.id}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {
                            if (!isDisabled) {
                                setTargetFolder({
                                    id: tree.parent.id,
                                    path: currentPath,
                                });
                            }
                        }}
                    />

                    <span>{tree.parent.name}</span>
                </div>

                {tree.children.length > 0 && (
                    <ul className="*:pl-3">
                        {tree.children.map((child) => (
                            <FolderTree
                                key={child.parent.id}
                                tree={child}
                                disabled={
                                    disabled || (movingFolder && isSource)
                                }
                                movingFolder={movingFolder}
                                path={currentPath}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <>
            <DashboardLayout
                override={true}
                useRightSidebar={{
                    active: activeFile !== null && fileModal == null,
                    children: FileInfoSidebar(),
                    handleSidebarClose() {
                        setActiveFile(null);
                    },
                    useDirectoryTheme: "",
                }}
            >
                {[
                    <>
                        {/* Folder */}
                        <ModalComponent
                            title={
                                folderModal == "add"
                                    ? "Add Folder"
                                    : `Edit '${activeFolder?.name}' folder`
                            }
                            icon={
                                folderModal == "add"
                                    ? FolderPlusIcon
                                    : undefined
                            }
                            isOpen={folderModal != null}
                            onClose={() => {
                                setFolderModal(null);
                                setActiveFolder(null);
                            }}
                            maxWidthClass="max-w-2xl"
                        >
                            <div className="space-y-1 *:p-1 *:space-y-1.5">
                                {folderModal === "add" && (
                                    <div>
                                        <DividerComponent text="Create Folder" />
                                        <InputComponent
                                            key={directory?.current.id}
                                            id="newFolder"
                                            label={{
                                                icon: FolderPlusIcon,
                                                text:
                                                    directory?.parentFolders
                                                        .map((fl) => fl.name)
                                                        .join("/") + "/",
                                            }}
                                            placeholder="Folder Name"
                                        >
                                            <ActionButton
                                                text="Create"
                                                icon={CheckCircleIcon}
                                                theme="primary"
                                                customise="rounded-none!"
                                                customiseLayer="rounded-none!"
                                                onClick={(e) => {
                                                    e.currentTarget.setAttribute(
                                                        "disabled",
                                                        "true",
                                                    );
                                                    addFolder(
                                                        (
                                                            document.querySelector(
                                                                "input#newFolder",
                                                            ) as HTMLInputElement
                                                        ).value,
                                                    );
                                                }}
                                                disabled={
                                                    notifications?.add !=
                                                        undefined &&
                                                    notifications?.add.type !==
                                                        "error" &&
                                                    (document.querySelector(
                                                        "input#newFolder",
                                                    ) as HTMLInputElement) &&
                                                    (
                                                        document.querySelector(
                                                            "input#newFolder",
                                                        ) as HTMLInputElement
                                                    ).value !== ""
                                                        ? true
                                                        : false
                                                }
                                            />
                                        </InputComponent>
                                        {notifications && notifications.add && (
                                            <Notification
                                                type={notifications.add.type}
                                                messages={
                                                    notifications.add.messages
                                                }
                                                customise="p-1! px-2!"
                                            />
                                        )}
                                    </div>
                                )}
                                {folderModal === "edit" && (
                                    <>
                                        <div>
                                            <DividerComponent text="Edit Folder Name" />
                                            <InputComponent
                                                id="folderNameEdit"
                                                label={{ icon: FolderOpenIcon }}
                                                placeholder="Folder Name"
                                                defaultValue={
                                                    activeFolder?.name
                                                }
                                            >
                                                <ActionButton
                                                    text="Rename"
                                                    icon={CheckCircleIcon}
                                                    theme="primary"
                                                    customise="rounded-none!"
                                                    customiseLayer="rounded-none!"
                                                    onClick={() => {
                                                        renameFolder(
                                                            activeFolder?.id +
                                                                "",
                                                            (
                                                                document.querySelector(
                                                                    "input#folderNameEdit",
                                                                ) as HTMLInputElement
                                                            ).value,
                                                        );
                                                    }}
                                                />
                                            </InputComponent>
                                            {notifications &&
                                                notifications.rename && (
                                                    <Notification
                                                        type={
                                                            notifications.rename
                                                                .type
                                                        }
                                                        messages={
                                                            notifications.rename
                                                                .messages
                                                        }
                                                        customise="p-1! px-2!"
                                                    />
                                                )}
                                        </div>
                                        {folderTree && (
                                            <div>
                                                <DividerComponent
                                                    text="Move File"
                                                    icon={ViewColumnsIcon}
                                                    inline
                                                />
                                                {notifications &&
                                                    notifications.move && (
                                                        <div className="sticky">
                                                            <Notification
                                                                type={
                                                                    notifications
                                                                        .move
                                                                        .type
                                                                }
                                                                messages={
                                                                    notifications
                                                                        .move
                                                                        .messages
                                                                }
                                                                customise="p-1.5!"
                                                            />
                                                        </div>
                                                    )}
                                                <div className="flex flex-wrap items-center gap-1 [&>p]:p-1 [&>p]:px-2 [&>p]:rounded-md [&>p]:bg-slate-50 [&>p]:dark:bg-secondary">
                                                    <p>
                                                        {directory?.parentFolders
                                                            .map((f) => f.name)
                                                            .join("/")}
                                                    </p>
                                                    <span>
                                                        <ArrowRightIcon className="size-4" />
                                                    </span>
                                                    <p className="text-primary">
                                                        {targetFolder?.path}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`
                                                        relative
                                                        max-h-60 overflow-y-scroll
                                                        [&_ul]:not-first:ml-2
                                                        [&_li]:p-1 [&_li]:cursor-pointer [&_li]:pl-4 [&_li]:space-y-1
                                                        [&_li]:hover:bg-cool/40 [&_li]:dark:hover:bg-secondary-dark/60 [&_li]:hover:rounded-md
                                                        bg-cool/10 dark:bg-secondary border border-slate-200 dark:border-cool/15 p-2 rounded-lg
                                                    `}
                                                >
                                                    <ul>
                                                        {folderTree && (
                                                            <FolderTree
                                                                tree={
                                                                    folderTree
                                                                }
                                                                movingFolder={
                                                                    true
                                                                }
                                                            />
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className="text-end">
                                                    <ActionButton
                                                        icon={
                                                            ArrowRightCircleIcon
                                                        }
                                                        iconAfter
                                                        customise="w-fit! ml-auto"
                                                        text="Move"
                                                        theme="primary"
                                                        onClick={moveFolder}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </ModalComponent>

                        {/* Edit File */}
                        <ModalComponent
                            title={
                                fileModal == "share"
                                    ? "Share File"
                                    : "Edit File"
                            }
                            isOpen={fileModal != null}
                            onClose={() => {
                                setFileModal(null);
                                setActiveFile(null);
                            }}
                            maxWidthClass="max-w-2xl"
                        >
                            <div className="space-y-1 *:p-1 *:space-y-1.5">
                                {fileModal === "edit" && (
                                    <>
                                        <div>
                                            <DividerComponent text="Edit File Name" />
                                            <InputComponent
                                                id="fileNameEdit"
                                                label={{ icon: FolderOpenIcon }}
                                                placeholder="File Name"
                                                defaultValue={
                                                    activeFile?.fileName
                                                }
                                            >
                                                <ActionButton
                                                    text="Rename"
                                                    icon={CheckCircleIcon}
                                                    theme="primary"
                                                    customise="rounded-none!"
                                                    customiseLayer="rounded-none!"
                                                    onClick={() => {
                                                        renameFile(
                                                            activeFile?.id + "",
                                                            (
                                                                document.querySelector(
                                                                    "input#fileNameEdit",
                                                                ) as HTMLInputElement
                                                            ).value,
                                                        );
                                                    }}
                                                />
                                            </InputComponent>
                                            {notifications &&
                                                notifications.rename && (
                                                    <Notification
                                                        type={
                                                            notifications.rename
                                                                .type
                                                        }
                                                        messages={
                                                            notifications.rename
                                                                .messages
                                                        }
                                                        customise="p-1! px-2!"
                                                    />
                                                )}
                                        </div>
                                        {folderTree && (
                                            <div>
                                                <DividerComponent
                                                    text="Move File"
                                                    icon={ViewColumnsIcon}
                                                    inline
                                                />
                                                {notifications &&
                                                    notifications.move && (
                                                        <div className="sticky">
                                                            <Notification
                                                                type={
                                                                    notifications
                                                                        .move
                                                                        .type
                                                                }
                                                                messages={
                                                                    notifications
                                                                        .move
                                                                        .messages
                                                                }
                                                                customise="p-1.5!"
                                                            />
                                                        </div>
                                                    )}
                                                <div className="flex flex-wrap items-center gap-1 [&>p]:p-1 [&>p]:px-2 [&>p]:rounded-md [&>p]:bg-slate-50 [&>p]:dark:bg-secondary">
                                                    <p>
                                                        {directory?.parentFolders
                                                            .map((f) => f.name)
                                                            .join("/")}
                                                    </p>
                                                    <span>
                                                        <ArrowRightIcon className="size-4" />
                                                    </span>
                                                    <p className="text-primary">
                                                        {targetFolder?.path}
                                                    </p>
                                                </div>
                                                <div
                                                    className={`
                                                        relative
                                                        max-h-60 overflow-y-scroll
                                                        [&_ul]:not-first:ml-2
                                                        [&_li]:p-1 [&_li]:cursor-pointer [&_li]:pl-4 [&_li]:space-y-1
                                                        [&_li]:hover:bg-cool/40 [&_li]:dark:hover:bg-secondary-dark/60 [&_li]:hover:rounded-md
                                                        bg-cool/10 dark:bg-secondary border border-slate-200 dark:border-cool/15 p-2 rounded-lg
                                                    `}
                                                >
                                                    <ul>
                                                        {folderTree && (
                                                            <FolderTree
                                                                tree={
                                                                    folderTree
                                                                }
                                                                movingFolder={
                                                                    false
                                                                }
                                                            />
                                                        )}
                                                    </ul>
                                                </div>
                                                <div className="text-end">
                                                    <ActionButton
                                                        icon={
                                                            ArrowRightCircleIcon
                                                        }
                                                        iconAfter
                                                        customise="w-fit! ml-auto"
                                                        text="Move"
                                                        theme="primary"
                                                        onClick={moveFile}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {fileModal === "share" && (
                                    <div>
                                        {/* File Information */}
                                        <div className="flex flex-wrap justify-between gap-2 p-2 rounded-md border border-slate-200 dark:border-cool/15 bg-slate-50 dark:bg-secondary shadow-sm">
                                            <DividerComponent
                                                text="File Info"
                                                inline
                                            />

                                            <div className="space-y-2 flex-1">
                                                <p className="text-primary">
                                                    <strong>
                                                        {
                                                            shareItem?.file
                                                                ?.fileName
                                                        }
                                                    </strong>
                                                </p>

                                                <p className="text-sm">
                                                    Type:{" "}
                                                    {shareItem?.file?.mimeType}
                                                </p>

                                                <p className="text-sm">
                                                    Size:{" "}
                                                    {formatBytes(
                                                        shareItem?.file
                                                            ?.fileSize ?? 0,
                                                    )}
                                                </p>

                                                <p className="text-sm">
                                                    Uploaded:{" "}
                                                    {DateFormatter.toFormattedDate(
                                                        shareItem?.file
                                                            ?.createdAt,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {notifications?.share && (
                                            <Notification
                                                type={notifications.share.type}
                                                messages={
                                                    notifications.share.messages
                                                }
                                            />
                                        )}

                                        {/* Search Users */}
                                        <DividerComponent
                                            text="Share File With"
                                            inline
                                        />

                                        <InputComponent
                                            id="userEmail"
                                            label={{ icon: UserIcon }}
                                            placeholder="User Email"
                                            type="email"
                                            value={searchEmail}
                                            onChange={(e) => {
                                                setSearchEmail(e.target.value);
                                            }}
                                        >
                                            <ActionButton
                                                text={
                                                    searchInProgress
                                                        ? "Searching..."
                                                        : "Search"
                                                }
                                                icon={MagnifyingGlassIcon}
                                                theme="primary-blur"
                                                customise="rounded-none!"
                                                customiseLayer="rounded-none!"
                                                disabled={
                                                    searchInProgress ||
                                                    !searchEmail.trim()
                                                }
                                                onClick={fetchUsersByEmail}
                                            />
                                        </InputComponent>

                                        {/* Search Results */}
                                        {emailResults.length > 0 ? (
                                            <>
                                                <div className="space-y-1">
                                                    {emailResults.map(
                                                        (user) => {
                                                            const isSelected =
                                                                selectedUsers.some(
                                                                    (
                                                                        selected,
                                                                    ) =>
                                                                        selected.id ===
                                                                        user.id,
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    className={`
                                                                        flex items-center justify-between
                                                                        gap-2 p-1 rounded-md
                                                                        border border-slate-200
                                                                        dark:border-cool/15
                                                                        bg-slate-50
                                                                        dark:bg-secondary
                                                                        ${isSelected ? "opacity-60" : ""}
                                                                    `}
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="font-medium truncate">
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </p>

                                                                        <p className="text-sm truncate">
                                                                            {
                                                                                user.email
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    <ActionButton
                                                                        text={
                                                                            isSelected
                                                                                ? "Added"
                                                                                : "Add"
                                                                        }
                                                                        icon={
                                                                            isSelected
                                                                                ? CheckCircleIcon
                                                                                : UserPlusIcon
                                                                        }
                                                                        theme={
                                                                            isSelected
                                                                                ? "secondary"
                                                                                : "primary-blur"
                                                                        }
                                                                        customise="shrink-0 py-1!"
                                                                        disabled={
                                                                            isSelected
                                                                        }
                                                                        onClick={() =>
                                                                            addSelectedUser(
                                                                                user,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-2 rounded-md bg-cool/20 dark:bg-secondary">
                                                <p className="text-sm">
                                                    No user found with matching
                                                    email
                                                </p>
                                            </div>
                                        )}

                                        {/* Search notification */}
                                        {notifications?.emailSearch && (
                                            <Notification
                                                type={
                                                    notifications.emailSearch
                                                        .type
                                                }
                                                messages={
                                                    notifications.emailSearch
                                                        .messages
                                                }
                                                customise="p-1! px-2!"
                                            />
                                        )}

                                        {/* Selected Users */}
                                        <DividerComponent text="Selected Users" />

                                        {selectedUsers.length === 0 ? (
                                            <div className="text-center p-2 rounded-md bg-cool/20 dark:bg-secondary">
                                                <p className="text-sm">
                                                    No users selected
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedUsers.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="
                                                            inline-flex items-center gap-2
                                                            p-1 px-2 rounded-md shadow-sm
                                                            border border-slate-200
                                                            dark:border-cool/15
                                                            "
                                                    >
                                                        <span>
                                                            {user.email}
                                                        </span>

                                                        <ActionButton
                                                            icon={XMarkIcon}
                                                            theme="primary-blur"
                                                            customise="p-0.5! rounded-md!"
                                                            customiseLayer="rounded-md"
                                                            onClick={() =>
                                                                removeSelectedUser(
                                                                    user.id,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* ExpiryDate */}
                                        <DividerComponent text="Share Expires by" />
                                        <InputComponent
                                            id="FileShareExpiryDate"
                                            label={{ icon: CalendarDaysIcon }}
                                            type="datetime-local"
                                            min={new Date(
                                                new Date().getTime() -
                                                    new Date().getTimezoneOffset() *
                                                        60000,
                                            )
                                                .toISOString()
                                                .slice(0, 16)}
                                            required
                                        />

                                        <ActionButton
                                            text="Share"
                                            icon={ShareIcon}
                                            theme="primary"
                                            customise="mt-2"
                                            disabled={
                                                selectedUsers.length === 0
                                            }
                                            onClick={shareFile}
                                        />
                                    </div>
                                )}
                            </div>
                        </ModalComponent>

                        <IconHeaderLayout
                            title={
                                loading
                                    ? "Loading..."
                                    : directory?.current.name + ""
                            }
                            description={
                                loading
                                    ? "Loading..."
                                    : `${directory?.subFolders.length} folders and ${directory?.files.length} files in category`
                            }
                        >
                            {/* Folders Section */}
                            <DashboardSection
                                header={{
                                    breadCrumbs: loading
                                        ? [{ text: "Fetching..." }]
                                        : (directory?.parentFolders ?? []).map(
                                              (folder) => ({
                                                  text: folder.name,
                                                  uri: RoutePaths.FOLDER.replace(
                                                      ":folderId",
                                                      folder.id,
                                                  ),
                                              }),
                                          ),
                                    description: loading
                                        ? "loading..."
                                        : `${directory?.subFolders.length} Folder(s)`,
                                    actionElements: [
                                        {
                                            button: {
                                                icon: FolderPlusIcon,
                                                text: "New Folder",
                                                onClick() {
                                                    updateNotifications(null);
                                                    setFolderModal("add");
                                                },
                                            },
                                        },
                                        {
                                            icon: {
                                                icon: ShareIcon,
                                                customise:
                                                    "p-2 size-8 shadow-md sm:hidden",
                                                theme: "primary",
                                            },
                                        },
                                        ...(directoryId != undefined
                                            ? [
                                                  {
                                                      dropdown: {
                                                          type: "icon",
                                                          props: {
                                                              theme: "primary",
                                                              customise:
                                                                  "p-2 shadow-sm",
                                                          },
                                                          items: [
                                                              {
                                                                  icon: {
                                                                      icon: PencilIcon,
                                                                  },
                                                                  title: "Edit Folder",
                                                                  onClick() {
                                                                      setActiveFolder(
                                                                          directory?.parentFolders.at(
                                                                              -1,
                                                                          ) ??
                                                                              null,
                                                                      );
                                                                      updateNotifications(
                                                                          null,
                                                                      );
                                                                      setTargetFolder(
                                                                          null,
                                                                      );
                                                                      setFolderModal(
                                                                          "edit",
                                                                      );
                                                                  },
                                                              },
                                                              {
                                                                  icon: {
                                                                      icon: TrashIcon,
                                                                  },
                                                                  title: "Delete Folder",
                                                                  onClick:
                                                                      () => {
                                                                          setActiveFolder(
                                                                              directory?.parentFolders.at(
                                                                                  -1,
                                                                              ) ??
                                                                                  null,
                                                                          );
                                                                          deleteFolder(
                                                                              directory?.parentFolders.at(
                                                                                  -1,
                                                                              ) ??
                                                                                  ({} as Folder),
                                                                          );
                                                                      },
                                                              },
                                                          ],
                                                      } as FloatingMenuComponentProps<Folder>,
                                                  },
                                              ]
                                            : []),
                                    ],
                                }}
                                spinner={{
                                    isLoading: loading,
                                    text: "Loading Folder Contents...",
                                }}
                            >
                                {directory &&
                                directory.subFolders.length > 0 ? (
                                    <div className="max-h-100 overflow-scroll grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                        {directory?.subFolders?.map(
                                            (folder) => {
                                                return (
                                                    <FolderComponent
                                                        key={`folder-${folder.id}`}
                                                        folder={folder}
                                                        handleDoubleClick={(
                                                            folder,
                                                        ) => {
                                                            navigate(
                                                                RoutePaths.FOLDER.replace(
                                                                    ":folderId",
                                                                    folder.id,
                                                                ),
                                                            );
                                                        }}
                                                        handleRenameClick={() => {
                                                            setActiveFolder(
                                                                folder,
                                                            );
                                                            updateNotifications(
                                                                null,
                                                            );
                                                            setTargetFolder(
                                                                null,
                                                            );
                                                            setFolderModal(
                                                                "edit",
                                                            );
                                                        }}
                                                        handleDeleteClick={
                                                            deleteFolder
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center capitalize rounded-md bg-cool/30 dark:bg-secondary-dark p-1">
                                        <p>No Folders inside</p>
                                    </div>
                                )}
                            </DashboardSection>
                            {/* Files Section */}
                            <FilesList
                                title={
                                    directoryId
                                        ? "/" +
                                          directory?.parentFolders.at(-1)?.name
                                        : "./"
                                }
                                files={directory?.files ?? []}
                                spinner={{
                                    isLoading: loading,
                                    text: "Loading Files...",
                                }}
                                handleDoubleClick={handleOpenFile}
                                handleFileUploadClick={() => {
                                    document
                                        .getElementById("fileUpload")
                                        ?.click();
                                }}
                                handleInfoButtonClick={handleFileInfoClick}
                                handleRenameFileClick={(file) => {
                                    setTargetFolder(null);
                                    setActiveFile(file);
                                    setFileModal("edit");
                                }}
                                handleShareFileClick={handleShareFileClick}
                                handleDeleteFileClick={deleteFile}
                                trackActiveFile={setActiveFile}
                                showUpload={true}
                            />
                        </IconHeaderLayout>
                        <input
                            type="file"
                            id="fileUpload"
                            className="hidden"
                            multiple
                            onChange={handleFileSelection}
                        />
                    </>,

                    // Focus Menu
                    <FocusMenu>
                        {/* Upload Options */}
                        <div className="container">
                            <DividerComponent
                                text="Upload"
                                icon={PlusCircleIcon}
                            />
                            <ActionButton
                                icon={ArrowUpTrayIcon}
                                text="Upload Files"
                                theme="primary"
                                onClick={() => {
                                    document
                                        .getElementById("fileUpload")
                                        ?.click();
                                }}
                            />
                            {uploadItems.length > 0 && (
                                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                                    {uploadItems.map((item, idx) => (
                                        <UploadComponent
                                            key={`${item.file.name}-${idx}`}
                                            file={item.file}
                                            progress={item.progress}
                                            status={item.status}
                                            error={item.error}
                                            handleCancelClick={
                                                handleCancelUpload
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Files */}
                        {latestFiles.length > 0 && (
                            <div className="container flex-1">
                                <DividerComponent
                                    text="Latest Files"
                                    icon={DocumentTextIcon}
                                />
                                {/* Latest Files */}
                                <div className="space-y-1">
                                    {latestFiles
                                        .slice(0, 6)
                                        .map((item, idx) => (
                                            <FileListComponent
                                                key={idx}
                                                file={item.file}
                                                useIcon={DocumentTextIcon}
                                                showFileSize={false}
                                                showOwner={false}
                                                dropdown={{
                                                    type: "icon",
                                                    useIcon:
                                                        EllipsisHorizontalIcon,
                                                    props: {
                                                        theme: "secondary-blur",
                                                        // menutheme: "secondary-blur",
                                                    },
                                                    alignment: "bottom",
                                                    items: [
                                                        {
                                                            target: item.file,
                                                            icon: {
                                                                icon: InformationCircleIcon,
                                                            },
                                                            text: "Info",
                                                            onClick(item) {
                                                                handleFileInfoClick(
                                                                    item as MetaFile,
                                                                    true,
                                                                );
                                                            },
                                                        },
                                                        ...(!item.shared
                                                            ? [
                                                                  {
                                                                      icon: {
                                                                          icon: PencilIcon,
                                                                      },
                                                                      text: "Edit",
                                                                      onClick() {
                                                                          setActiveFile(
                                                                              item.file,
                                                                          );
                                                                          setFileModal(
                                                                              "edit",
                                                                          );
                                                                      },
                                                                  },
                                                                  {
                                                                      icon: {
                                                                          icon: ShareIcon,
                                                                      },
                                                                      text: "Share",
                                                                      onClick() {
                                                                          handleShareFileClick(
                                                                              item.file,
                                                                          );
                                                                      },
                                                                  },
                                                              ]
                                                            : []),
                                                    ],
                                                    menuId: `latestFile-${item.file.id}`,
                                                    activeMenu,
                                                    setActiveMenu,
                                                }}
                                                handleDoubleClick={
                                                    handleOpenFile
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </FocusMenu>,
                ]}
            </DashboardLayout>
        </>
    );
}
