import { AppShell, Box, NavLink, ScrollArea } from '@mantine/core';
import { useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { me } from '../apis/auth';
import { Logo, UserMenu } from '../components';
import Links from '../system/links';
import { Link } from 'react-router-dom';
export default function PrivateLayout() {
    const navigate = useNavigate();

    const location = useLocation();

    const checkAuth = useCallback(async () => {
        const data = await me();

        if (!data || !data.data) {
            navigate(Links.LOGIN);
        }
    }, [navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
            <AppShell.Header>
                <Box className="flex items-center justify-between h-full px-4">
                    <Logo />

                    <UserMenu />
                </Box>
            </AppShell.Header>
            <AppShell.Navbar px={'md'} pb={'md'}>
                <AppShell.Section grow my="md" component={ScrollArea}>
                    <div className="w-full h-full flex flex-col gap-3">
                        {Links.MENUS.map((menu, index) => (
                            <NavLink
                                component={Link}
                                className="rounded-sm"
                                key={menu.path + index}
                                to={menu.path}
                                label={menu.title}
                                active={location.pathname === menu.path}
                                leftSection={<menu.icon size={16} stroke={1.5} />}
                            />
                        ))}
                    </div>
                </AppShell.Section>
                <AppShell.Section className="text-sm text-center">From KTQ 2025</AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
