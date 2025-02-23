import { ComboboxData } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getTags } from '../apis/tag';
import { ITag } from '../system/type';

export default function useTags() {
    const [data, setData] = useState<ITag[]>([]);

    const handleGetData = async () => {
        const result = await getTags({ per_page: 100 });

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
