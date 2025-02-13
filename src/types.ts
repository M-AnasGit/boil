export type CommandType = {
    type: "add" | "change" | "unlink";
    args: {
        filePath: string;
        content?: string;
    };
};

export type SaveActionOptions = {
    name: string;
    local?: string;
    global?: boolean;
};

export type UseActionOptions = {
    local?: string;
    global?: string;
};
