/* eslint-disable @typescript-eslint/no-unused-vars */
import { handleError } from '.';
import axios from '../lib/axios';

export const getDashboard = async () => {
    try {
        const { data } = await axios({
            url: 'dashboards',
            withCredentials: true,
            method: 'GET',
        });

        return data?.data;
    } catch (error) {
        handleError(error);
    }
};
