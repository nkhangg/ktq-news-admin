import { useEffect, useState } from 'react';
import { getCategories } from '../apis/category';
import { ICategory } from '../system/type';
import { ComboboxData } from '@mantine/core';

export default function usePermissions() {
    const [data, setData] = useState<ICategory[]>([]);

    const handleGetData = async () => {
        const result = await getCategories({ per_page: 100 });

        if (!result || !result.data?.data) return;

        setData(result.data.data);
    };

    useEffect(() => {
        handleGetData();
    }, []);

    return {
        data,
        select: data.map((item) => {
            return { label: item.name, value: String(item.id) };
        }) as ComboboxData,
        refresh: handleGetData,
    };
}
