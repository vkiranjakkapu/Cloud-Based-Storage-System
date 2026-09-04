import {
    ArrowUpTrayIcon,
    DocumentDuplicateIcon,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    InformationCircleIcon,
    PencilIcon,
    PlusCircleIcon,
    ShareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import ActionButton from "../../components/ActionButtonComponent";
import FileListComponent from "../../components/directories/FileListComponent";
import DividerComponent from "../../components/nav/DividerComponent";
import FocusMenu from "../../components/nav/FocusMenu";
import {
    UploadComponent,
    type UploadComponentProps,
} from "../../components/UploadComponent";
import type { DirectoryResponse } from "../../services/DirectoryService";
import type { MetaFile } from "../../services/FileService";

export default function DirectorySideMenu(
    uploadItems: UploadComponentProps[],
    directory: DirectoryResponse | null,
    activeMenu: string | null,
    handleCancelUpload: (fileToCancel: File) => void,
    handleOpenFile: (file: MetaFile) => void,
    handleFileInfoClick: (file: MetaFile) => void,
    setActiveFile: Dispatch<SetStateAction<MetaFile | null>>,
    handleRenameFileClick: (file: MetaFile) => void,
    handleShareFileClick: (file: MetaFile) => void,
    handleDeleteFileClick: (file: MetaFile) => void,
    setActiveMenu: Dispatch<SetStateAction<string | null>>,
): ReactNode {
    return (
        <FocusMenu>
            {/* Upload Options */}
            <div className="container">
                <DividerComponent text="Upload" icon={PlusCircleIcon} />
                <ActionButton
                    icon={ArrowUpTrayIcon}
                    text="Upload Files"
                    theme="primary"
                    onClick={() => {
                        document.getElementById("fileUpload")?.click();
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
                                handleCancelClick={handleCancelUpload}
                            />
                        ))}
                    </div>
                )}
            </div>
            {(directory?.sharedFiles ?? []).length > 0 && (
                <div className="container flex-1">
                    <DividerComponent
                        text="Shared Files"
                        icon={DocumentDuplicateIcon}
                    />
                    {/* Shared Files */}
                    <div className="space-y-1">
                        {(directory?.sharedFiles?.slice(0, 5) ?? []).map(
                            (file, idx) => (
                                <FileListComponent
                                    key={idx}
                                    file={file}
                                    useIcon={DocumentTextIcon}
                                    showFileSize={false}
                                    showOwner={false}
                                    handleDoubleClick={handleOpenFile}
                                    infoButton={{
                                        onClick(file) {
                                            handleFileInfoClick(file);
                                        },
                                    }}
                                    trackSelectedFile={(file) => {
                                        setActiveFile(file);
                                    }}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
            {/* Files */}
            <div className="container flex-1">
                <DividerComponent text="Latest Files" icon={DocumentTextIcon} />
                {/* Latest Files */}
                <div className="space-y-1">
                    {(directory?.files?.slice(0, 5) ?? []).map((file, idx) => (
                        <FileListComponent
                            key={idx}
                            file={file}
                            useIcon={DocumentTextIcon}
                            showFileSize={false}
                            showOwner={false}
                            dropdown={{
                                type: "icon",
                                useIcon: EllipsisHorizontalIcon,
                                props: {
                                    theme: "secondary-blur",
                                    // menutheme: "secondary-blur",
                                },
                                alignment: "bottom",
                                items: [
                                    {
                                        target: file,
                                        icon: {
                                            icon: InformationCircleIcon,
                                        },
                                        text: "Info",
                                        onClick(item) {
                                            handleFileInfoClick(
                                                item as MetaFile,
                                            );
                                        },
                                    },
                                    {
                                        target: file,
                                        icon: { icon: PencilIcon },
                                        text: "Rename",
                                        onClick(item) {
                                            handleRenameFileClick(
                                                item as MetaFile,
                                            );
                                        },
                                    },
                                    {
                                        target: file,
                                        icon: { icon: ShareIcon },
                                        text: "Share",
                                        onClick(item) {
                                            handleShareFileClick(
                                                item as MetaFile,
                                            );
                                        },
                                    },
                                    {
                                        target: file,
                                        icon: {
                                            icon: TrashIcon,
                                            customiseIcon:
                                                "group-hover:text-rose-500!",
                                        },
                                        text: "Delete",
                                        onClick(item) {
                                            handleDeleteFileClick(
                                                item as MetaFile,
                                            );
                                        },
                                    },
                                ],
                                menuId: `latestFile-${file.id}`,
                                activeMenu,
                                setActiveMenu,
                            }}
                            handleDoubleClick={handleOpenFile}
                            trackSelectedFile={(file) => {
                                setActiveFile(file);
                            }}
                        />
                    ))}
                </div>
            </div>
        </FocusMenu>
    );
}
