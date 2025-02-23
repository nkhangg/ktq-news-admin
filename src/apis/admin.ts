import { generateNestParams, handleError, handleSuccess } from '.';
import axios from '../lib/axios';
import { IAdmin } from '../system/type';
import { removeFalsyValues } from '../utils';

export const getAdmins = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'admins',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};

export const updateAdmin = async (admin: Partial<IAdmin>) => {
    const { email, fullname, permissions } = removeFalsyValues(admin);

    try {
        const { data } = await axios({
            url: 'admins/' + admin.id,
            withCredentials: true,
            method: 'PUT',
            data: { email, fullname, permissions },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const grantNewPasswordAdmin = async (admin: Partial<IAdmin>) => {
    const { password } = removeFalsyValues(admin);

    try {
        const { data } = await axios({
            url: 'admins/grant-new-password/' + admin.id,
            withCredentials: true,
            method: 'POST',
            data: { password },
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const createAdmin = async (admin: Omit<IAdmin, 'id' | 'created_at' | 'updated_at' | 'is_system_account'>) => {
    const newData = removeFalsyValues(admin);

    try {
        const { data } = await axios({
            url: 'admins',
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

export const deleteAdmin = async (admin: IAdmin) => {
    try {
        const { data } = await axios({
            url: 'admins/' + admin.id,
            withCredentials: true,
            method: 'DELETE',
        });

        handleSuccess(data);

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const deletesAdmin = async (admins: IAdmin[]) => {
    const ids = admins.reduce((prev, cur) => {
        prev.push(cur.id);
        return prev;
    }, [] as number[]);
    try {
        const { data } = await axios({
            url: 'admins/deletes',
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
