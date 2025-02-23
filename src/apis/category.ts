import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { ICategory } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getCategories = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'categories',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const createCategory = async (category: Pick<ICategory, 'name' | 'description' | 'slug'>) => {
    try {
        const { data } = await axios({
            url: 'categories',
            withCredentials: true,
            method: 'POST',
            data: category,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const updateCategory = async (category: Partial<ICategory>) => {
    const { name, description, slug } = removeFalsyValues(category);

    try {
        const { data } = await axios({
            url: 'categories/' + category.id,
            withCredentials: true,
            method: 'PUT',
            data: { name, description, slug },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteCategory = async (category: ICategory) => {
    try {
        const { data } = await axios({
            url: 'categories/' + category.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
export const deleteCategories = async (categories: ICategory[]) => {
    const ids = categories.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'categories/deletes',
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
