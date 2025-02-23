import { generateNestParams, handleError, handleSuccess } from '.';
import axios, { IResponse } from '../lib/axios';
import { IPost, ITag } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getPosts = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'posts',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const getPost = async (id: IPost['id']) => {
    try {
        const { data } = await axios({
            url: 'posts/' + id,
            withCredentials: true,
            method: 'GET',
        });

        return data as IResponse<IPost>;
    } catch (error) {
        handleError(error);
    }
};

export const createPost = async (post: Partial<IPost> & { category_id: string }) => {
    try {
        const { data } = await axios({
            url: 'posts',
            withCredentials: true,
            method: 'POST',
            data: post,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updatePost = async ({ id, created_at, updated_at, admin, category, ...post }: Partial<IPost> & { category_id: string }) => {
    const newData = removeFalsyValues(post);
    try {
        const { data } = await axios({
            url: 'posts/' + id,
            withCredentials: true,
            method: 'PUT',
            data: newData,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const updateTag = async (tag: Partial<ITag>) => {
    const { name, slug } = removeFalsyValues(tag);

    try {
        const { data } = await axios({
            url: 'tags/' + tag.id,
            withCredentials: true,
            method: 'PUT',
            data: { name, slug },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deletePost = async (post: IPost) => {
    try {
        const { data } = await axios({
            url: 'posts/' + post.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deletePosts = async (posts: IPost[]) => {
    const ids = posts.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'posts/deletes',
            withCredentials: true,
            method: 'POST',
            data: {
                ids,
            },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
