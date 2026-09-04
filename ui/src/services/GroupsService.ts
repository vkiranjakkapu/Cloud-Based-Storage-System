import type { FileAccess } from "./DirectoryService";

class GroupsService {}

export default new GroupsService();

export type Group = {
    id: string;
    title: string;
    description: string;
    files: FileAccess[];
    participants: GroupParticipant[];
    createdAt: string;
};

export type GroupParticipant = {
    id: number;
    group: Group;
    memberId: string;
    memberType: MemberType;
    createdAt: string;
};

export const MemberType = {
    OWNER: "OWNER",
    EDITOR: "EDITOR",
    VIEWER: "VIEWER",
} as const;

export type MemberType = (typeof MemberType)[keyof typeof MemberType];
