import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { IFeedback } from '../system/type';

export const getFeedbacks = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'feedbacks',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const deleteFeedback = async (tag: IFeedback) => {
    try {
        const { data } = await axios({
            url: 'feedbacks/' + tag.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteFeedbacks = async (tags: IFeedback[]) => {
    const ids = tags.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'feedbacks/deletes',
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
