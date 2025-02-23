import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { ILike } from '../system/type';

export const getLikes = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'likes',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const deleteLike = async (tag: ILike) => {
    try {
        const { data } = await axios({
            url: 'likes/' + tag.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteLikes = async (tags: ILike[]) => {
    const ids = tags.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'likes/deletes',
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
