import { ShareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DashboardSection from "../../components/layouts/DashboardSection";
import { RoutePaths } from "../../routes/RoutePaths";
import type { DirectoryResponse } from "../../services/DirectoryService";
import DirectoryService from "../../services/DirectoryService";
import FileService, { type MetaFile } from "../../services/FileService";
import { DateFormatter } from "../../utils/DateFormatter";

export default function FilePage() {
    const { folderId, fileId } = useParams<{
        folderId: string;
        fileId: string;
    }>();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fileLoading, setFileLoading] = useState<boolean>(true);

    const [folder, setFolder] = useState<DirectoryResponse | null>(null);
    const [file, setFile] = useState<MetaFile | null>(null);

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        DirectoryService.getDirectoryContents<DirectoryResponse>(folderId)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setFolder(resp.data);
                }
            })
            .finally(() => setIsLoading(false));
        FileService.getFileContent<Blob>(fileId).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                const url = URL.createObjectURL(resp.data);
                setFileUrl(url);
            }
        });
        FileService.getFileById<MetaFile>(fileId + "")
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setFile(resp.data);
                }
            })
            .finally(() => setFileLoading(false));
    }, [folderId, fileId]);

    useEffect(() => {
        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);

    return (
        <DashboardLayout spinner={{ isLoading, text: "Fetching File..." }}>
            {[
                <DashboardSection
                    header={{
                        breadCrumbs:
                            isLoading || fileLoading
                                ? [{ text: "Fetching..." }]
                                : (folder?.parentFolders ?? [])
                                      .map((folder) => ({
                                          text: folder.name,
                                          uri: RoutePaths.FOLDER.replace(
                                              ":folderId",
                                              folder.id,
                                          ),
                                      }))
                                      .concat([
                                          {
                                              text: file?.fileName + "",
                                              uri: "",
                                          },
                                      ]),
                        description: fileLoading ? `Loading File...` : `uploaded on ${DateFormatter.toFormattedDate(file?.createdAt)}`,
                        actionElements: [
                            {
                                icon: {
                                    icon: ShareIcon,
                                    theme: "primary",
                                },
                            },
                        ],
                    }}
                >
                    <iframe
                        src={fileUrl ?? undefined}
                        className="w-full h-[82vh] border"
                        title={file?.fileName}
                    ></iframe>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
