import { useEffect, useState } from "react";

import {
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
    type PieSectorShapeProps,
} from "recharts";

import DashboardLayout from "../../components/layouts/DashboardLayout";

import DashboardSection from "../../components/layouts/DashboardSection";

import usePrincipal from "../../context/usePrincipal";

import type { FileReport } from "../../services/ReportsService";

import ReportsService from "../../services/ReportsService";

const FILE_TYPES: Record<string, string> = {
    "application/pdf": "PDF",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",

    "image/png": "PNG",

    "image/jpeg": "JPG",

    "video/mp4": "MP4",
};

const FILE_COLORS: Record<string, string> = {
    PDF: "#6387A6",
    XLSX: "#C5E2E6",
    DOCX: "#F2E4BB",
    PNG: "#F2B66D",
    JPG: "#F28157",
};

const formatMB = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

type ChartData = {
    name: string;
    value: number;
};

const CustomPie = (props: PieSectorShapeProps) => {
    return (
        <Sector
            {...props}
            fill={FILE_COLORS[props.name as string] ?? "#C5E2E6"}
        />
    );
};

const CustomLegend = ({
    payload,
}: {
    payload?: readonly {
        value?: string | number;
        payload?: ChartData;
    }[];
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {payload?.map((entry) => {
                const color = FILE_COLORS[entry.value as string] ?? "#C5E2E6";

                return (
                    <div key={entry.value} className="flex items-center gap-2">
                        <span
                            className="size-3 rounded-sm"
                            style={{
                                backgroundColor: color,
                            }}
                        />

                        <span
                            style={{
                                color,
                            }}
                        >
                            {entry.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default function Dashboard() {
    const { profile } = usePrincipal();

    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        ReportsService.getFileReports<FileReport[]>()
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setChartData(
                        resp.data.map((item) => ({
                            name: FILE_TYPES[item.type] ?? item.type,
                            value: item.totalSize,
                        })),
                    );
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <DashboardLayout>
            {[
                <DashboardSection
                    header={{
                        title: "Dashboard",
                        description: `Welcome back, ${profile?.name}.`,
                    }}
                    spinner={{
                        isLoading,
                        text: "Preparing Reports...",
                        animate: "animate-pulse",
                    }}
                >
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label={({ value }) =>
                                        formatMB(Number(value))
                                    }
                                    shape={CustomPie}
                                />

                                <Tooltip
                                    formatter={(value) =>
                                        formatMB(Number(value))
                                    }
                                />

                                <Legend content={<CustomLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </DashboardSection>,
            ]}
        </DashboardLayout>
    );
}
