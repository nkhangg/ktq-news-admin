import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { ITag } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getTags = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'tags',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const createTag = async (tag: Pick<ITag, 'name' | 'slug'>) => {
    try {
        const { data } = await axios({
            url: 'tags',
            withCredentials: true,
            method: 'POST',
            data: tag,
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

export const deleteTag = async (tag: ITag) => {
    try {
        const { data } = await axios({
            url: 'tags/' + tag.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteTags = async (tags: ITag[]) => {
    const ids = tags.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'tags/deletes',
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
