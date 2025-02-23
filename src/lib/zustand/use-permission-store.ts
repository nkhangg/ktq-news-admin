import { create } from 'zustand';
import _ from 'lodash';
import { IPermission } from '../../system/type';

interface ConfirmState {
    basePermission: IPermission[];
    permissions: IPermission[];
    setPermission: (newPermission: IPermission) => void;
    setPermissions: (newPermissions: IPermission[]) => void;
    setBasePermissions: (newPermissions: IPermission[]) => void;
    deletePermission: (permission: IPermission) => void;
}

export const usePermissionStore = create<ConfirmState>((set) => ({
    basePermission: [],
    permissions: [],
    setPermission: (newPermission: IPermission) =>
        set((state) => ({
            permissions: _.uniqBy([...state.permissions, newPermission], 'id'),
        })),

    setPermissions: (newPermissions: IPermission[]) =>
        set(() => ({
            permissions: _.uniqBy(newPermissions, 'id'),
        })),
    setBasePermissions: (newPermissions: IPermission[]) =>
        set(() => ({
            basePermission: _.uniqBy(newPermissions, 'id'),
        })),
    deletePermission: (permission: IPermission) =>
        set((state) => ({
            permissions: state.permissions.filter((p) => p.id !== permission.id),
        })),
}));
