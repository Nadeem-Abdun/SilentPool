interface SessionInfo {
    alias: string;
    sessionToken: string;
}

export const saveSessionInfo = (alias: string, sessionToken: string): void => {
    sessionStorage.setItem("alias", alias);
    sessionStorage.setItem("sessionToken", sessionToken);
};

export const getSessionInfo = (): SessionInfo | null => {
    const alias = sessionStorage.getItem("alias");
    const sessionToken = sessionStorage.getItem("sessionToken");
    if (alias && sessionToken) {
        return { alias, sessionToken };
    }
    return null;
};

export const clearSessionInfo = (): void => {
    sessionStorage.removeItem("alias");
    sessionStorage.removeItem("sessionToken");
};
