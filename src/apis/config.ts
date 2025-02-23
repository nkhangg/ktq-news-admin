/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { IConfig } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getConfigs = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'configs',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const createConfig = async (config: Omit<IConfig, 'id' | 'created_at' | 'updated_at'>) => {
    const newData = removeFalsyValues(config);

    try {
        const { data } = await axios({
            url: 'configs',
            withCredentials: true,
            method: 'POST',
            data: newData,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const updateConfig = async (config: Partial<IConfig>) => {
    const { id, key_name, created_at, updated_at, ...values } = removeFalsyValues(config);

    try {
        const { data } = await axios({
            url: 'configs/' + id,
            withCredentials: true,
            method: 'PUT',
            data: values,
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteConfig = async (config: IConfig) => {
    try {
        const { data } = await axios({
            url: 'configs/' + config.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deletesConfig = async (configs: IConfig[]) => {
    const ids = configs.map((item) => item.id);

    try {
        const { data } = await axios({
            url: 'configs/deletes',
            withCredentials: true,
            method: 'POST',
            data: { ids },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};
