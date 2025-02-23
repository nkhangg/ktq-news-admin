export interface IAdmin extends ITimestamp {
    id: number;
    email: string;
    username: string;
    fullname: string;
    password?: string;
    is_system_account: boolean;
    permissions: IPermission[];
}

export interface IPermission extends ITimestamp {
    id: number;
    name: string;
    description: string;
}

export interface IConfig extends ITimestamp {
    id: number;
    key_name: string;
    value: string;
    type: 'json' | 'number' | 'string';
}

export interface ITimestamp {
    created_at: string;
    updated_at: string;
}

export interface IMedia extends ITimestamp {
    id: number;
    name: string;
    path: string;
    original_path: string;
    media_type: string;
}

export interface ICategory extends ITimestamp {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface ITag extends ITimestamp {
    id: number;
    name: string;
    slug: string;
}

export interface ISearchHistory extends ITimestamp {
    id: number;
    search_count: number;
    post: IPost;
}

export interface ILike extends ITimestamp {
    id: number;
    action: 'like' | 'unlike';
    ip_client: number;
}

export interface IHistory extends ITimestamp {
    id: number;
    ip_client: number;
}

export interface IFeedback extends ITimestamp {
    id: number;
    email: string;
    fullname: string;
    message: string;
}

export interface IPost extends ITimestamp {
    id: number;
    thumbnail: string;
    title: string;
    content: string;
    preview_content: string;
    ttr: number;
    slug: string;
    like_count: number;
    admin: IAdmin;
    tags: ITag[];
    category: ICategory;
}
