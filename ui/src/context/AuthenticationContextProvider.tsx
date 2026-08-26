import { useCallback, useEffect, useState, type ReactNode } from "react";
import AuthService, {
    type LoginRequest,
    type LoginResponse,
} from "../services/AuthService";
import TokenStorage from "../storage/TokenStorage";
import {
    AuthStatus,
    PrincipalContext,
    RoleType,
    type UserProfile,
} from "./usePrincipal";

export type AuthenticationContextProviderProps = {
    children: ReactNode;
};

export default function AuthenticationContextProvider({
    children,
}: AuthenticationContextProviderProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // lazy initializer -
    // Runs this initialization logic when the state is initially created,
    // rather than evaluating it on every render.
    const [status, setStatus] = useState<AuthStatus>(() => {
        return TokenStorage.getAccessToken() !== null
            ? AuthStatus.INITIALIZING
            : AuthStatus.UNAUTHENTICATED;
    });

    const fetchProfile = useCallback(() => {
        AuthService.getMe<UserProfile>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setProfile(resp.data);
                setStatus(AuthStatus.AUTHENTICATED);
            } else {
                setStatus(AuthStatus.UNAUTHENTICATED);
                console.log(resp);
            }
        });
    }, []);

    useEffect(() => {
        if (TokenStorage.getAccessToken() !== null) {
            fetchProfile();
        }
    }, [fetchProfile]);

    const login = useCallback(
        (request: LoginRequest) => {
            setStatus(AuthStatus.INITIALIZING);
            AuthService.login<LoginResponse>(request)
                .then((resp) => {
                    if (resp && !("errorMessage" in resp)) {
                        TokenStorage.save(
                            resp.data.accessToken,
                            resp.data.refreshToken,
                        );
                        fetchProfile();
                    } else {
                        setStatus(AuthStatus.UNAUTHENTICATED);
                        console.log(resp);
                    }
                })
                .catch((e) => {
                    setStatus(AuthStatus.UNAUTHENTICATED);
                    console.log(e);
                });
        },
        [fetchProfile],
    );

    const logout = useCallback(() => {
        AuthService.logout<unknown>()
            .catch((e) => console.error("Logout request failed", e))
            .finally(() => {
                TokenStorage.clear();
                setProfile(null);
                setStatus(AuthStatus.UNAUTHENTICATED);
            });
    }, []);

    const isLoggedIn = status === AuthStatus.AUTHENTICATED;

    const isAdmin =
        isLoggedIn &&
        profile !== null &&
        profile.roles.includes(RoleType.ADMIN);

    return (
        <PrincipalContext
            value={{
                profile,
                status,
                isLoggedIn,
                isAdmin,
                login,
                logout,
            }}
        >
            {children}
        </PrincipalContext>
    );
}
