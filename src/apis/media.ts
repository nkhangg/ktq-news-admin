import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { IMedia } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getMedias = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'medias',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const deleteMedia = async (media: IMedia) => {
    try {
        const { data } = await axios({
            url: 'medias/' + media.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const uploadMedia = async (data: { link?: string; image?: File; width?: number; height?: number }) => {
    const newData = removeFalsyValues(data);

    const formData = new FormData();
    Object.keys(newData).forEach((key) => {
        if (newData[key as keyof typeof newData]) {
            if (key === 'image') {
                formData.append(key, newData[key as keyof typeof newData] as File);
            } else {
                formData.append(key, String(newData[key as keyof typeof newData]));
            }
        }
    });

    try {
        const { data } = await axios({
            url: 'medias',
            withCredentials: true,
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        handleSuccess(data);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteMedias = async (medias: IMedia[]) => {
    const ids = medias.map((item) => item.id);
    try {
        const { data } = await axios({
            url: 'medias/deletes',
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
