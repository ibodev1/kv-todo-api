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
    subjectId: string;
    createdAt: number;
    updatedAt: number;
}

export interface Respond {
    status: "success" | "error",
    data?: Todo | Subject | Todo[] | Subject[] | string | null;
    message?: string | null;
    responseTime: number;
}

export type Bindings = {
    PORT: string;
}

export type Variables = {
    port: number;
}