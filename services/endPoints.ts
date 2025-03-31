const SERVICE_URL = {
    BASE_URL: "http://localhost:4000",
    // BASE_URL: "https://silentpool-backend.onrender.com",
};
export const WEBSOCKET_URL = {
    BASE_URL: "ws://localhost:4000",
    // BASE_URL: "wss://silentpool-backend.onrender.com",
};
const API_VER_V1 = '/api/v1';

export const authorizationPaths = {
    generateAnonymId: `${SERVICE_URL.BASE_URL}${API_VER_V1}/auth/anonymous`,
};

export const poolPaths = {
    createPool: `${SERVICE_URL.BASE_URL}${API_VER_V1}/pools/create`,
    joinPool: `${SERVICE_URL.BASE_URL}${API_VER_V1}/pools/join`,
    leavePool: `${SERVICE_URL.BASE_URL}${API_VER_V1}/pools/leave`,
    getPoolInfo: (poolId: string) => `${SERVICE_URL.BASE_URL}${API_VER_V1}/pools/info/${poolId}`,
};

export const messagePaths = {
    getMessages: (poolId: string) => `${SERVICE_URL.BASE_URL}${API_VER_V1}/messages/${poolId}/messages`,
};
