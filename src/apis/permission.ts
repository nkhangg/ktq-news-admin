import { generateNestParams } from '.';
import axios from '../lib/axios';

export const getPermissions = async (params: Record<string, string | number>) => {
    return await axios({
        url: 'permissions',
        params: generateNestParams(params),
        withCredentials: true,
        method: 'GET',
    });
};
