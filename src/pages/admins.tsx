import { ActionIcon, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconMenu, IconPassword, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { deleteAdmin, getAdmins } from '../apis/admin';
import { AdminModal, GrantNewPasswordModal } from '../components/admin';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { IAdmin } from '../system/type';
import { formatTime } from '../utils';

export default function Admins() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<IAdmin> = useRef({});

    const [adminModelOpened, adminModel] = useDisclosure(false);
    const [grantOpened, grantModel] = useDisclosure(false);
    const [clickData, setClickData] = useState<IAdmin | null>(null);

    const columns: IColumn<IAdmin>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },
        {
            key: 'username',
            title: 'Username',
            typeFilter: 'text',
        },
        {
            key: 'email',
            title: 'Email',
            typeFilter: 'text',
        },
        {
            key: 'created_at',
            title: 'Created at',
            typeFilter: 'none',
            renderRow(row) {
                return <span>{formatTime(row.created_at)}</span>;
            },
        },
        {
            key: 'updated_at',
            title: 'Update at',
            typeFilter: 'none',
            renderRow(row) {
                return <span>{formatTime(row.updated_at)}</span>;
            },
        },
    ];

    const handleDelete = (admin: IAdmin) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This admin will be delete',
            handleOk: async () => {
                await deleteAdmin(admin);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getAdminsFn = useCallback(getAdmins, []);

    const table = useMemo(() => {
        return (
            <Table
                actionsOptions={{
                    actions: [
                        {
                            key: 'add',
                            title: 'Add',
                            callback: () => {
                                adminModel.open();
                            },
                        },
                    ],
                }}
                refTableFn={refTableFn}
                striped
                showLoading={true}
                highlightOnHover
                styleDefaultHead={{
                    justifyContent: 'flex-start',
                    width: 'fit-content',
                }}
                options={{
                    query: getAdminsFn,
                    pathToData: 'data.data',
                    keyOptions: {
                        last_page: 'lastPage',
                        per_page: 'perPage',
                        from: 'from',
                        to: 'to',
                        total: 'total',
                    },
                }}
                rows={[]}
                withColumnBorders
                showChooses={false}
                withTableBorder
                columns={columns}
                actions={{
                    title: <Box className="w-full text-center">Action</Box>,
                    body: (row) => {
                        return (
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Box className="flex w-full items-center justify-center">
                                        <ActionIcon size="sm" variant="light">
                                            <IconMenu size={14} />
                                        </ActionIcon>
                                    </Box>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => {
                                            setClickData(row);
                                            adminModel.open();
                                        }}
                                        leftSection={<IconEdit size={14} />}
                                    >
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => {
                                            setClickData(row);
                                            grantModel.open();
                                        }}
                                        leftSection={<IconPassword size={14} />}
                                    >
                                        Grant new password
                                    </Menu.Item>
                                    <Menu.Item disabled={row.is_system_account} onClick={() => handleDelete(row)} leftSection={<IconTrash color="red" size={14} />}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        );
                    },
                }}
                rowKey="id"
            />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box>
            {table}

            <AdminModal
                onUpdated={refTableFn.current.fetchData}
                data={clickData}
                opened={adminModelOpened}
                onClose={() => {
                    setClickData(null);
                    adminModel.close();
                }}
            />

            <GrantNewPasswordModal
                opened={grantOpened}
                data={clickData}
                onClose={() => {
                    setClickData(null);
                    grantModel.close();
                }}
            />
        </Box>
    );
}
