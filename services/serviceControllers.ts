import { CommunicationModule } from "./communicationModule";
import { authorizationPaths, poolPaths, messagePaths } from "../services/endPoints";
import { getSessionInfo } from "@/utilities/sessionsHandler";

// Authorization Service Controllers
export const GetAnonymousIdentity = async () => {
    return await CommunicationModule(authorizationPaths.generateAnonymId, {
        method: "GET",
    });
};

// Pool Service Controllers
export const GetCreatePool = async () => {
    const sessionToken = getSessionInfo()?.sessionToken;
    if (!sessionToken) { return null; }
    return await CommunicationModule(poolPaths.createPool, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${sessionToken}`,
        }
    });
};
export const PostJoinPool = async (formData: any) => {
    const sessionToken = getSessionInfo()?.sessionToken;
    if (!sessionToken) { return null; }
    return await CommunicationModule(poolPaths.joinPool, {
        method: "POST",
        body: formData,
        isFormData: false,
        headers: {
            "authorization": `Bearer ${sessionToken}`,
        }
    });
};
export const PostLeavePool = async (formData: any) => {
    const sessionToken = getSessionInfo()?.sessionToken;
    if (!sessionToken) { return null; }
    return await CommunicationModule(poolPaths.leavePool, {
        method: "POST",
        body: formData,
        isFormData: false,
        headers: {
            "authorization": `Bearer ${sessionToken}`,
        }
    });
};

// Message Service Controllers
export const GetMessages = async (poolId: string) => {
    const sessionToken = getSessionInfo()?.sessionToken;
    if (!sessionToken) { return null; }
    return await CommunicationModule(messagePaths.getMessages(poolId), {
        method: "GET",
        headers: {
            "authorization": `Bearer ${sessionToken}`,
        }
    });
};
