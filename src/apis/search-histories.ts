import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { ISearchHistory } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getSearchHistories = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'search-histories',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const createSearchHistories = async (searchHistory: Pick<ISearchHistory, 'search_count'> & { post_id: number }) => {
    try {
        const { data } = await axios({
            url: 'search-histories',
            withCredentials: true,
            method: 'POST',
            data: searchHistory,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const updateSearchHistories = async (searchHistory: Pick<ISearchHistory, 'id' | 'search_count'>) => {
    const { search_count } = removeFalsyValues(searchHistory);

    try {
        const { data } = await axios({
            url: 'search-histories/' + searchHistory.id,
            withCredentials: true,
            method: 'PUT',
            data: { search_count },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteSearchHistory = async (tag: ISearchHistory) => {
    try {
        const { data } = await axios({
            url: 'search-histories/' + tag.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteSearchHistories = async (tags: ISearchHistory[]) => {
    const ids = tags.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'search-histories/deletes',
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
