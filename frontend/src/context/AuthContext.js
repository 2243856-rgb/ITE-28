import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    clearAccessToken,
    loadStoredAccessToken,
    persistAccessToken,
} from "../services/authSession";
import {
    fetchMeRequest,
    loginRequest,
    registerOwnerRequest,
} from "../services/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [booting, setBooting] = useState(true);
    const [error, setError] = useState(null);

    const hydrate = useCallback(async () => {
        setError(null);
        const token = await loadStoredAccessToken();
        if (!token) {
            setUser(null);
            setBooting(false);
            return;
        }
        const me = await fetchMeRequest();
        if (me.ok) {
            setUser(me.user);
        } else {
            await clearAccessToken();
            setUser(null);
        }
        setBooting(false);
    }, []);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const login = useCallback(async (email, password) => {
        setError(null);
        const res = await loginRequest(email, password);
        if (!res.ok) {
            setError(res.message);
            return { ok: false, message: res.message };
        }
        await persistAccessToken(res.data.accessToken);
        const me = await fetchMeRequest();
        if (!me.ok) {
            await clearAccessToken();
            setError(me.message);
            return { ok: false, message: me.message };
        }
        setUser(me.user);
        return { ok: true };
    }, []);

    const register = useCallback(
        async ({ fullName, email, password, phoneNumber }) => {
            setError(null);
            const reg = await registerOwnerRequest({
                fullName,
                email,
                password,
                phoneNumber: phoneNumber || undefined,
            });
            if (!reg.ok) {
                setError(reg.message);
                return {
                    ok: false,
                    phase: "register",
                    message: reg.message,
                };
            }
            const loginRes = await login(email, password);
            if (!loginRes.ok) {
                const msg = `Account was created, but automatic sign-in failed: ${loginRes.message}. Try “Back to sign in” and log in manually.`;
                setError(msg);
                return { ok: false, phase: "login", message: msg };
            }
            return { ok: true };
        },
        [login]
    );

    const logout = useCallback(async () => {
        await clearAccessToken();
        setUser(null);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const refreshUser = useCallback(async () => {
        const me = await fetchMeRequest();
        if (me.ok) setUser(me.user);
    }, []);

    const value = useMemo(
        () => ({
            user,
            booting,
            error,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
            refreshUser,
            hydrate,
            clearError,
        }),
        [user, booting, error, login, register, logout, refreshUser, hydrate, clearError]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
