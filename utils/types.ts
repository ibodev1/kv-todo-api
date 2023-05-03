export interface Subject {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
}

export interface Todo {
    id: string;
    title: string;
    isDone: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface Respond {
    status: "success" | "error",
    data?: any | null;
    message?: string | null;
    responseTime: number;
}

export type Bindings = {
    PORT: string;
}

export type Variables = {
    port: number;
}