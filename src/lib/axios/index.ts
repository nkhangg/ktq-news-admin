import ax from 'axios';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';

export interface IResponse<R> {
    message: string;
    status_code: HttpStatusCode;
    data: R;
    timestamp: string;
}

export interface IResponsePagination<T> extends IResponse<T> {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
}

const axios = ax.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            toast.error('Access denied');
        }
        return Promise.reject(error);
    },
);

export default axios;
