import { ActionIcon, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconMenu, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { deleteSearchHistories, deleteSearchHistory, getSearchHistories } from '../apis/search-histories';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { ISearchHistory } from '../system/type';
import { formatTime } from '../utils';
import { SearchHistoryModal } from '../components/search-histories';

export default function SearchHistories() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<ISearchHistory> = useRef({});

    const [opened, { open, close }] = useDisclosure(false);

    const [clickedData, setClickedData] = useState<null | ISearchHistory>(null);

    const columns: IColumn<ISearchHistory>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },

        {
            key: 'search_count',
            title: 'Search count',
            typeFilter: 'number',
            renderRow: (row) => {
                return <span>{row.search_count} search</span>;
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

    const handleDelete = (tag: ISearchHistory) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This tag will be delete',
            handleOk: async () => {
                await deleteSearchHistory(tag);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getSearchHistoriesFn = useCallback(getSearchHistories, []);

    const table = useMemo(() => {
        return (
            <Table
                actionsOptions={{
                    actions: [
                        {
                            key: 'add',
                            title: 'Add',
                            callback: () => {
                                open();
                            },
                        },
                        {
                            key: 'delete',
                            title: 'Delete',
                            callback: (chooses) => {
                                if (!chooses.length) return;
                                setConfirm({
                                    title: 'Delete',
                                    message: `${chooses.length} will be delete`,
                                    handleOk: async () => {
                                        const result = await deleteSearchHistories(chooses);

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
                    query: getSearchHistoriesFn,
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
                                            setClickedData(row);
                                            open();
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

            <SearchHistoryModal
                opened={opened}
                onClose={() => {
                    close();
                    setClickedData(null);
                }}
                onUpdated={refTableFn.current.fetchData}
                data={clickedData}
            />
        </Box>
    );
}
