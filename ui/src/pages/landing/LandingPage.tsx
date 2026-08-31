import LoginForm from "../auth/LoginForm";
import FavIcon from "/favicon.png"

export default function LandingPage() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="m-8 p-4 w-full md:w-2/3 lg:w-3/5 space-y-3 rounded-lg bg-white/60 dark:bg-secondary border-slate-200 dark:border-cool/15 backdrop-blur-md">
                <div className="text-center space-y-1 p-2 bg-white/60 backdrop-blur-md  dark:bg-cool/15 rounded-lg overflow-hidden">
                    <img src={FavIcon} alt="CBSS ICON" className="size-15 mx-auto roundeed-xl" />
                    <span className="text-primary">Cloud Based Storage System</span>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
