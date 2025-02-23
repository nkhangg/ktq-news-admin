import { ActionIcon, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconMenu, IconTrash } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';
import { deleteConfig, deletesConfig, getConfigs } from '../apis/config';
import ConfigModal from '../components/config/config-modal';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { IConfig } from '../system/type';
import { formatTime } from '../utils';

export default function Configs() {
    const refTableFn: TRefTableFn<IConfig> = useRef({});

    const [configModalOpened, configModal] = useDisclosure(false);
    const [clickData, setClickData] = useState<IConfig | null>(null);

    const { setConfirm } = useConfirmStore();

    const columns: IColumn<IConfig>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },
        {
            key: 'key_name',
            title: 'Key',
            typeFilter: 'text',
        },
        {
            key: 'value',
            title: 'Value',
            typeFilter: 'text',
        },
        {
            key: 'type',
            title: 'Type',
            typeFilter: {
                data: [
                    { label: 'JSON', value: 'json' },
                    { label: 'NUMBER', value: 'number' },
                    { label: 'STRING', value: 'string' },
                ],
                type: 'select',
            },
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

    const handleDelete = (config: IConfig) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This config will be delete',
            handleOk: async () => {
                await deleteConfig(config);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const table = useMemo(() => {
        return (
            <Table
                actionsOptions={{
                    actions: [
                        {
                            key: 'add',
                            title: 'Add',
                            callback: () => {
                                configModal.open();
                            },
                        },
                        {
                            key: 'delete',
                            title: 'Delete',
                            callback: (data) => {
                                if (!data.length) return;
                                setConfirm({
                                    title: 'Delete',
                                    message: `${data.length} will be delete`,
                                    handleOk: async () => {
                                        const result = await deletesConfig(data);

                                        if (!result) return;
                                        if (refTableFn.current.fetchData) {
                                            refTableFn.current.fetchData();
                                        }
                                    },
                                });
                            },
                            disabled: (data) => data.length <= 0,
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
                    query: getConfigs,
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
                showChooses={true}
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
                                            configModal.open();
                                        }}
                                        leftSection={<IconEdit size={14} />}
                                    >
                                        Edit
                                    </Menu.Item>

                                    <Menu.Item onClick={() => handleDelete(row)} leftSection={<IconTrash color="red" size={14} />}>
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

            <ConfigModal
                onUpdated={refTableFn.current.fetchData}
                data={clickData}
                opened={configModalOpened}
                onClose={() => {
                    configModal.close();
                    setClickData(null);
                }}
            />
        </Box>
    );
}
