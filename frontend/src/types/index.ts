// Types for Todo List Application

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    contactNumber?: string;
    position?: string;
    avatar?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type TaskPriority = 'Extreme' | 'Moderate' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';
export type CategoryType = 'status' | 'priority';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    date?: string;
    image?: string;
    userId: string;
    categoryId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskPayload {
    title: string;
    description?: string;
    priority: TaskPriority;
    status?: TaskStatus;
    date?: string;
    image?: string;
    categoryId?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> { }

export interface Category {
    _id: string;
    type: CategoryType;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesResponse {
    statuses: Category[];
    priorities: Category[];
}

export interface TaskStatus_Item {
    _id: string;
    label: string;
    userId: string;
}

export interface TaskPriority_Item {
    _id: string;
    label: string;
    userId: string;
}

export interface TaskStats {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
    completedPercent: number;
    inProgressPercent: number;
    notStartedPercent: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TasksResponse {
    tasks: Task[];
    meta: PaginationMeta;
}

export interface ApiError {
    message: string;
    status?: number;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    contactNumber?: string;
    position?: string;
}
