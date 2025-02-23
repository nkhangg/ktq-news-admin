import { Link } from 'react-router-dom';
import Links from '../system/links';
import { Box } from '@mantine/core';

export default function Logo() {
    return (
        <Box className="flex items-center justify-center h-full max-w-fit">
            <Link to={Links.DASHBOARD} className="exo-2 text-2xl font-bold">
                React Admin
            </Link>
        </Box>
    );
}
