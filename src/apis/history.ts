import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { IHistory } from '../system/type';

export const getHistories = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'histories',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const deleteHistory = async (history: IHistory) => {
    try {
        const { data } = await axios({
            url: 'histories/' + history.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteHistories = async (histories: IHistory[]) => {
    const ids = histories.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'histories/deletes',
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
