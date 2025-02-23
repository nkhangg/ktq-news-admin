import { useEffect, useState } from 'react';
import { IPermission } from '../system/type';
import { getPermissions } from '../apis/permission';
import { usePermissionStore } from '../lib/zustand/use-permission-store';

export default function usePermissions() {
    const [data, setData] = useState<IPermission[]>([]);

    const { setBasePermissions } = usePermissionStore();

    const handleGetData = async () => {
        const result = await getPermissions({ per_page: 100 });

        if (!result || !result.data?.data) return;

        setData(result.data.data);
        setBasePermissions(result.data.data);
    };

    useEffect(() => {
        handleGetData();
    }, []);

    return data;
}
