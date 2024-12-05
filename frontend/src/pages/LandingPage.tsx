import AuthForm from "../components/AuthForm";
import Picture from "../components/Picture";

const LandingPage = () => {
    return (
        <div className="flex h-screen items-center justify-center p-2">
            <div className="flex flex-col md:flex-row items-center justify-center w-full md:max-w-screen-lg space-y-2 md:space-y-0 md:space-x-2">
                <div className="hidden md:flex flex-none justify-center">
                    <Picture />
                </div>
                <div className="flex flex-1 items-center justify-center w-full">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
