import {
    ChevronRightIcon,
    HomeIcon,
    PlusIcon,
} from "@heroicons/react/16/solid";
import IconComponent from "../../components/IconComponent";

export default function LandingPage() {
    return (
        <div className="p-3">
            <div className="bg-slate-100 p-4">
                <h1>Home</h1>
                <IconComponent icon={HomeIcon} theme="primary" />
                <IconComponent icon={HomeIcon} theme="primary-blur" />
                <div className="bg-primary rounded p-2 group">
                    <IconComponent
                        icon={ChevronRightIcon}
                        theme="blur"
                    />
                </div>
                <IconComponent icon={PlusIcon} theme="secondary" />
                <IconComponent icon={HomeIcon} theme="secondary-blur" />
                <IconComponent icon={HomeIcon} />
            </div>
        </div>
    );
}
