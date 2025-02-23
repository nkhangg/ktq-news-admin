/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import { IResponse } from '../lib/axios';
import { ITableFilter } from '../lib/table/type';
import { defaultPrefixShort, searchKey } from '../lib/table/ultils';

export const handleError = (error: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (error as AxiosError).response as Record<string, any>;

    const data = response.data;

    if (response.status === HttpStatusCode.Forbidden) return;

    if (data?.errors && (data.errors as []).length) {
        let newMessage = data.errors[0].errors[0];

        if ((data.errors as []).length > 1) {
            newMessage = newMessage + ` and ${data.errors.length} errors`;
        }

        toast.error(newMessage || 'Internal Server Error');

        return;
    }
    toast.error((response?.data.message as string) || 'Internal Server Error');
};

export const handleSuccess = <R>(data: IResponse<R>) => {
    toast.success(data.message);
};

export function parseFilterToParams<T extends Record<string, any>>(data: ITableFilter<T>[]) {
    if (!data) return null;

    return data.reduce((acc, item) => {
        acc[item.key] = item.type;
        return acc;
    }, {} as Record<string, any>);
}

export function generateNestParams(params: Record<string, any>) {
    const excludeKeys = ['page'];

    const prefixSortKey = defaultPrefixShort;

    if (!params) return params;

    const newParams = Object.keys(params).reduce((prev, cur) => {
        if (excludeKeys.includes(cur)) {
            prev[cur] = params[cur];
        } else if (cur.includes(prefixSortKey)) {
            prev['sortBy'] = `${cur.replace(defaultPrefixShort, '')}:${String(params[cur]).toLocaleUpperCase()}`;
        } else if (cur === 'per_page') {
            prev['limit'] = params[cur];
        } else if (cur === searchKey) {
            prev['search'] = params[cur];
        } else {
            prev[`filter.${cur}`] = params[cur];
        }

        return prev;
    }, {} as Record<string, any>);
    return newParams;
}
