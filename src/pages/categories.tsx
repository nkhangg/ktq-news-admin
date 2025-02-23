import { ActionIcon, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconMenu, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { deleteCategories, deleteCategory, getCategories } from '../apis/category';
import { CategoryModal } from '../components/categories';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { ICategory } from '../system/type';
import { formatTime } from '../utils';

export default function Categories() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<ICategory> = useRef({});

    const [opened, { open, close }] = useDisclosure(false);

    const [clickedData, setClickedData] = useState<null | ICategory>(null);

    const columns: IColumn<ICategory>[] = [
        {
            key: 'id',
            title: 'ID',
            typeFilter: 'number',
        },

        {
            key: 'name',
            title: 'Name',
            typeFilter: 'text',
        },
        {
            key: 'slug',
            title: 'Slug',
            typeFilter: 'text',
        },
        {
            key: 'description',
            title: 'Description',
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

    const handleDelete = (category: ICategory) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This category will be delete',
            handleOk: async () => {
                await deleteCategory(category);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getCategoriesFn = useCallback(getCategories, []);

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
                                        const result = await deleteCategories(chooses);

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
                    query: getCategoriesFn,
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

            <CategoryModal
                opened={opened}
                onClose={() => {
                    close();
                    setClickedData(null);
                }}
                data={clickedData}
                onUpdated={refTableFn.current.fetchData}
            />
        </Box>
    );
}
