import { handleError, handleSuccess } from '.';
import axios, { IResponse } from '../lib/axios';
import { IAdmin } from '../system/type';

export const login = async (credentials: { username: string; password: string }) => {
    try {
        const { data } = await axios({
            url: 'auth/login',
            data: credentials,
            withCredentials: true,
            method: 'POST',
        });

        handleSuccess(data);

        return data as IResponse<boolean>;
    } catch (error) {
        handleError(error);
    }
};

export const logout = async () => {
    try {
        const { data } = await axios({
            url: 'auth/logout',
            withCredentials: true,
            method: 'POST',
        });

        return data as IResponse<boolean>;
    } catch (error) {
        handleError(error);
    }
};

export const changePassword = async (credentials: { newPassword: string; password: string }) => {
    try {
        const { data } = await axios({
            url: 'auth/change-password',
            withCredentials: true,
            method: 'POST',
            data: credentials,
        });

        handleSuccess(data);
        return data as IResponse<boolean>;
    } catch (error) {
        handleError(error);
    }
};

export const me = async () => {
    try {
        const { data } = await axios({
            url: 'auth/me',
            method: 'GET',
            withCredentials: true,
        });

        return data as IResponse<IAdmin>;
    } catch (error) {
        handleError(error);
    }
};
