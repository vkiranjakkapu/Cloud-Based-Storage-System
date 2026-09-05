import {
    ArrowUpTrayIcon,
    DocumentTextIcon,
    ListBulletIcon,
    PencilIcon,
    ShareIcon,
    Squares2X2Icon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import FileIconComponent from "../../components/directories/FileIconComponent";
import DashboardSection from "../../components/layouts/DashboardSection";
import usePagination from "../../components/pagination/usePagination";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import FileListComponent from "../../components/directories/FileListComponent";
import { type SpinnerComponentProps } from "../../components/SpinnerComponent";
import type { MetaFile } from "../../services/FileService";

type FilesListProps = {
    files: MetaFile[];
    title?: string;
    spinner?: SpinnerComponentProps & {
        isLoading: boolean;
    };
    showUpload?: boolean;
    showManageButtons?: boolean;

    handleDoubleClick: (item: MetaFile) => void;
    handleFileUploadClick?: () => void;
    handleInfoButtonClick?: (file: MetaFile) => void;
    handleRenameFileClick?: (file: MetaFile) => void;
    handleShareFileClick?: (file: MetaFile) => void;
    handleDeleteFileClick?: (file: MetaFile) => void;
    trackActiveFile?: Dispatch<SetStateAction<MetaFile | null>>;
};

export default function FilesList({
    files,
    title,
    spinner,
    showUpload = false,
    showManageButtons = true,
    handleDoubleClick,
    handleFileUploadClick,
    handleInfoButtonClick,
    handleRenameFileClick,
    handleShareFileClick,
    handleDeleteFileClick,
    trackActiveFile,
}: FilesListProps) {
    const [iconView, setIconView] = useState<boolean>(true);

    const [queryString, setQueryString] = useState<string | null>(null);

    const [activeFile, setActiveFile] = useState<MetaFile | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        trackActiveFile?.(activeFile);
    }, [activeFile, trackActiveFile]);

    const queryFiles = useMemo(() => {
        if (files.length === 0) return [];

        if (!queryString) return files;

        const fileteredFiles = files.filter((fl) =>
            fl.fileName.match(queryString),
        );

        return fileteredFiles;
    }, [files, queryString]);

    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const {
        currentItems,
        currentPage,
        totalPages,
        goToNextPage,
        changePage,
        goToPrevPage,
    } = usePagination<MetaFile>(queryFiles, itemsPerPage);

    return (
        <DashboardSection
            header={{
                title,
                description:
                    files.length > 0 ? `${files.length} File(s)` : undefined,
                actionElements: [
                    ...(showUpload
                        ? [
                              {
                                  button: {
                                      icon: ArrowUpTrayIcon,
                                      customiseIcon: "size-4!",
                                      text: "Upload File",
                                      onClick() {
                                          handleFileUploadClick?.();
                                      },
                                  },
                              },
                          ]
                        : []),
                    ...(files.length > 0
                        ? [
                              {
                                  iconGroup: {
                                      buttons: [
                                          {
                                              icon: Squares2X2Icon,
                                              active: iconView,
                                              onClick: () => {
                                                  setIconView(true);
                                                  setItemsPerPage(10);
                                              },
                                          },
                                          {
                                              icon: ListBulletIcon,
                                              active: !iconView,
                                              onClick: () => {
                                                  setIconView(false);
                                                  setItemsPerPage(6);
                                              },
                                          },
                                      ],
                                  },
                              },
                          ]
                        : []),
                ],
            }}
            spinner={spinner}
        >
            {files.length > 0 ? (
                <DashboardSection
                    search={
                        files.length > 0
                            ? {
                                  id: "searchFiles",
                                  placeholder: "Filename",
                                  customise: "w-full md:w-3/5 lg:w-3/4",
                                  label: { icon: DocumentTextIcon },
                                  onChange: (e) => {
                                      setQueryString(e.target.value);
                                  },
                              }
                            : undefined
                    }
                    pagination={{
                        totalPages,
                        currentPage,
                        goToNextPage,
                        goToPrevPage,
                        changePage,
                        theme: "primary",
                    }}
                >
                    {iconView && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                            {currentItems.map((file) => {
                                return (
                                    <FileIconComponent
                                        key={file.id}
                                        file={file}
                                        dropdown={
                                            showManageButtons
                                                ? {
                                                      type: "icon",
                                                      props: {
                                                          onClick: () => {
                                                              setActiveFile(
                                                                  file,
                                                              );
                                                          },
                                                      },
                                                      items: [
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: TrashIcon,
                                                                  customiseIcon:
                                                                      "text-rose-500!",
                                                              },
                                                              title: "Delete",
                                                              onClick: (
                                                                  file,
                                                              ) => {
                                                                  handleDeleteFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: ShareIcon,
                                                              },
                                                              title: "Share",
                                                              onClick: (
                                                                  file: MetaFile,
                                                              ) => {
                                                                  handleShareFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: PencilIcon,
                                                              },
                                                              title: "Rename",
                                                              onClick: (
                                                                  file: MetaFile,
                                                              ) => {
                                                                  handleRenameFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                      ],
                                                      menuId:
                                                          "fileIconView-" +
                                                          file.id +
                                                          file.fileName,
                                                      activeMenu,
                                                      setActiveMenu,
                                                  }
                                                : undefined
                                        }
                                        isActive={activeFile?.id === file.id}
                                        onActiveChange={(file) =>
                                            setActiveFile(file)
                                        }
                                        handleInfoClick={(file) => {
                                            handleInfoButtonClick?.(file);
                                        }}
                                        handleDoubleClick={handleDoubleClick}
                                        clearActiveMenu={() =>
                                            setActiveMenu(null)
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                    {!iconView && (
                        <div className="space-y-1">
                            {currentItems.map((file) => {
                                return (
                                    <FileListComponent
                                        key={file.id}
                                        file={file}
                                        infoButton={{
                                            onClick: (file) =>
                                                handleInfoButtonClick?.(file),
                                        }}
                                        dropdown={
                                            showManageButtons
                                                ? {
                                                      type: "icon",
                                                      useIcon:
                                                          EllipsisVerticalIcon,
                                                      props: {
                                                          theme: "secondary-blur",
                                                      },
                                                      alignment: "left",
                                                      items: [
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: TrashIcon,
                                                                  customiseIcon:
                                                                      "text-rose-500!",
                                                              },
                                                              title: "Delete",
                                                              onClick: (
                                                                  file,
                                                              ) => {
                                                                  handleDeleteFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: ShareIcon,
                                                              },
                                                              title: "Share",
                                                              onClick: (
                                                                  file,
                                                              ) => {
                                                                  handleShareFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                          {
                                                              target: file,
                                                              icon: {
                                                                  icon: PencilIcon,
                                                              },
                                                              title: "Rename",
                                                              onClick: (
                                                                  file,
                                                              ) => {
                                                                  handleRenameFileClick?.(
                                                                      file as MetaFile,
                                                                  );
                                                              },
                                                          },
                                                      ],
                                                      menuId:
                                                          "fileListView-" +
                                                          file.id,
                                                      activeMenu,
                                                      setActiveMenu,
                                                  }
                                                : undefined
                                        }
                                        handleDoubleClick={handleDoubleClick}
                                        trackSelectedFile={trackActiveFile}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {queryFiles.length == 0 && (
                        <div className="text-center capitalize">
                            <p>No files with given Search</p>
                        </div>
                    )}
                </DashboardSection>
            ) : (
                <div className="text-center capitalize rounded-md bg-cool/30 dark:bg-secondary-dark p-1">
                    <p>No Files inside</p>
                </div>
            )}
        </DashboardSection>
    );
}
