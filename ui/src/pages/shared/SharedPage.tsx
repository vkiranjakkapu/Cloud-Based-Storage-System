import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import type { LatestFiles, MetaFile } from "../../services/FileService";
import FileService from "../../services/FileService";
import FilesList from "../directory/FilesList";
import { RoutePaths } from "../../routes/RoutePaths";
import ModalComponent from "../../components/ModalComponent";
import DividerComponent from "../../components/nav/DividerComponent";
import { formatBytes } from "../../utils/FileUploadHelper";
import { DateFormatter } from "../../utils/DateFormatter";
import type { UserProfile } from "../../context/usePrincipal";

export default function SharedPage() {
    const [allFiles, setAllFiles] = useState<LatestFiles[]>([]);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);

    useEffect(() => {
        FileService.getSharedFiles<LatestFiles[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllFiles(resp.data);
            }
        });
    }, []);

    return (
        <DashboardLayout override>
            {[
                <DashboardSection
                    header={{
                        title: "Shared With You",
                        description:
                            "This page shows all files shared with you",
                    }}
                    useDirectoryTheme=""
                >
                    <ModalComponent
                        title="Information"
                        isOpen={activeFile != null}
                        onClose={() => {
                            setActiveFile(null);
                        }}
                    >
                        {/* File Information */}
                        <div className="flex flex-wrap justify-between gap-2 p-2 rounded-md border border-slate-200 dark:border-cool/15 bg-slate-50 dark:bg-secondary shadow-sm">
                            <DividerComponent text="File Info" inline />

                            <div className="space-y-2 flex-1">
                                <p className="text-primary">
                                    <strong>{activeFile?.fileName}</strong>
                                </p>

                                <p className="text-sm">
                                    Type: {activeFile?.mimeType}
                                </p>

                                <p className="text-sm">
                                    Size:{" "}
                                    {formatBytes(activeFile?.fileSize ?? 0)}
                                </p>

                                <p className="text-sm">
                                    Uploaded:{" "}
                                    {DateFormatter.toFormattedDate(
                                        activeFile?.createdAt,
                                    )}
                                </p>
                                <p className="text-sm">
                                    <strong className="dark:text-warm">
                                        Owner:{" "}
                                    </strong>
                                    {`${activeFile?.owner?.name} (${activeFile?.owner?.email})`}
                                </p>
                            </div>
                        </div>
                    </ModalComponent>
                    <FilesList
                        files={allFiles.map((item) => item.file)}
                        handleDoubleClick={(file) => {
                            window.open(
                                RoutePaths.FILE.replace(
                                    ":folderId",
                                    file.folder.id,
                                ).replace(":fileId", file.id),
                                "_blank",
                            );
                        }}
                        handleInfoButtonClick={(file) => {
                            const share = allFiles
                                .filter((fi) => fi.file.id === file.id)
                                .at(0);
                            const owner = {
                                ...share?.owner,
                                name: `${share?.owner.firstName} ${share?.owner.lastName}`,
                            } as UserProfile;
                            file.owner = owner;
                            setActiveFile(file);
                        }}
                        showManageButtons={false}
                    />
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
