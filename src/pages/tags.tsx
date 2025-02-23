import { ActionIcon, Box, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconMenu, IconTrash } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { deleteTag, deleteTags, getTags } from '../apis/tag';
import Table from '../lib/table/table';
import { IColumn, TRefTableFn } from '../lib/table/type';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import { ITag } from '../system/type';
import { formatTime } from '../utils';
import { TagModal } from '../components/tags';

export default function Tags() {
    const { setConfirm } = useConfirmStore();

    const refTableFn: TRefTableFn<ITag> = useRef({});

    const [opened, { open, close }] = useDisclosure(false);

    const [clickedData, setClickedData] = useState<null | ITag>(null);

    const columns: IColumn<ITag>[] = [
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

    const handleDelete = (tag: ITag) => {
        setConfirm({
            title: 'Delete ?',
            message: 'This tag will be delete',
            handleOk: async () => {
                await deleteTag(tag);

                if (refTableFn.current?.fetchData) {
                    refTableFn.current.fetchData();
                }
            },
        });
    };

    const getTagsFn = useCallback(getTags, []);

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
                                        const result = await deleteTags(chooses);

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
                    query: getTagsFn,
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

            <TagModal
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
