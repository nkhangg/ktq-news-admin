import { Button, createTheme, Group, MantineProvider, Modal } from '@mantine/core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Categories, Configs, CreatePost, Dashboard, Feedbacks, Histories, Likes, Login, Medias, Posts, SearchHistories, Tags } from '.';
import { GlobalNotification } from '../components';
import { PrivateLayout } from '../layouts';
import { useConfirmStore } from '../lib/zustand/use-confirm';
import Links from '../system/links';
import Admins from './admins';
import UpdatePost from './update-post';

const theme = createTheme({});

export default function App() {
    const { props, open, close } = useConfirmStore();

    return (
        <BrowserRouter>
            <MantineProvider theme={theme} defaultColorScheme="dark">
                <Routes>
                    <Route path={Links.HOME} element={<Navigate to={Links.DASHBOARD} replace />} />
                    <Route path={Links.LOGIN} element={<Login />} />
                    <Route element={<PrivateLayout />}>
                        <Route path={Links.DASHBOARD} element={<Dashboard />} />
                        <Route path={Links.CONFIGS} element={<Configs />} />

                        <Route path={Links.ADMINS} element={<Admins />} />
                        <Route path={Links.MEDIAS} element={<Medias />} />
                        <Route path={Links.CATEGORIES} element={<Categories />} />
                        <Route path={Links.POSTS} element={<Posts />} />
                        <Route path={Links.TAGS} element={<Tags />} />
                        <Route path={Links.CREATE_POST()} element={<CreatePost />} />
                        <Route path={Links.POSTS + '/:id'} element={<UpdatePost />} />
                        <Route path={Links.SEARCH_HISTORIES} element={<SearchHistories />} />
                        <Route path={Links.LIKE} element={<Likes />} />
                        <Route path={Links.HISTORIES} element={<Histories />} />
                        <Route path={Links.FEEDBACKS} element={<Feedbacks />} />
                    </Route>
                </Routes>

                <GlobalNotification />

                <Modal zIndex={9999} opened={open} onClose={close} title={props?.title || 'Are you sure this action?'}>
                    {props?.message}
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={close} variant="default">
                            Cancel
                        </Button>
                        <Button
                            onClick={
                                props.handleOk
                                    ? async () => {
                                          props.handleOk?.();
                                          close();
                                      }
                                    : undefined
                            }
                            color="red"
                            {...props.okButton}
                        >
                            {props.okButton?.value || 'Delete'}
                        </Button>
                    </Group>
                </Modal>
            </MantineProvider>
        </BrowserRouter>
    );
}
