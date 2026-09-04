import {
    CheckCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import type { UploadProgressDetails } from "../services/UploadService";
import { formatBytes } from "../utils/FileUploadHelper";
import ActionButton from "./ActionButtonComponent";
import Notification from "./Notification";
import SpinnerComponent from "./SpinnerComponent";

export type UploadStatus = "uploading" | "success" | "error";

export interface UploadComponentProps {
    file: File;
    progress: UploadProgressDetails;
    status: UploadStatus;
    error?: string;
    controller?: AbortController;
    handleCancelClick?: (file: File) => void;
}

export function UploadComponent({
    file,
    progress,
    status,
    error,
    handleCancelClick,
}: UploadComponentProps) {
    return (
        <div className="p-2 space-y-1 border border-slate-200 dark:border-cool/15 bg-slate-100 dark:bg-secondary rounded-md shadow-xs text-sm">
            <div className="flex gap-0.5 items-center justify-around">
                <div className="flex-col gap-0.5 items-center justify-center">
                    {status === "success" ? (
                        <CheckCircleIcon className="size-5 text-emerald-500" />
                    ) : status === "error" ? (
                        <XCircleIcon className="size-5 text-rose-600" />
                    ) : (
                        <SpinnerComponent />
                    )}
                </div>
                <div
                    className={`flex-1 flex-col items-start justify-start max-w-[22ch]`}
                >
                    <p className="w-full truncate">{file?.name}</p>
                    {status !== "error" && (
                        <p className="text-xs mr-auto">
                            {`${formatBytes(progress.loaded)} / ${formatBytes(progress.total)} ${progress.percentage}%`}
                        </p>
                    )}
                </div>
                {status === "uploading" && (
                    <div>
                        <ActionButton
                            icon={XMarkIcon}
                            theme="secondary-blur"
                            customise="size-5! rounded-md! ml-auto p-0!"
                            customiseLayer="rounded-md!"
                            customiseIcon="size-4!"
                            onClick={() => handleCancelClick?.(file)}
                        />
                    </div>
                )}
            </div>
            {error && (
                <Notification
                    type="error"
                    messages={[error]}
                    customise="p-1! px-1.5! text-xs"
                    hideIcon={true}
                />
            )}
        </div>
    );
}
