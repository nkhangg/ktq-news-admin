/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Card, SimpleGrid, Text, Title } from '@mantine/core';
import { IconEye, IconFileText, IconHeart } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getDashboard } from '../apis/dashboard';
function StatCard({ title, value, icon }: { title: string; value: number; icon: any }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {icon}
                <div>
                    <Text size="sm" color="dimmed">
                        {title}
                    </Text>
                    <Text size="xl">{value}</Text>
                </div>
            </div>
        </Card>
    );
}

// function ChartCard({ title, data }: { title: string; data: any }) {
//     console.log(data);
//     return (
//         <Card shadow="sm" padding="lg" radius="md" withBorder>
//             <Text size="sm" color="dimmed" mb="md">
//                 {title}
//             </Text>
//             <LineChart
//                 h={300}
//                 data={[
//                     {
//                         date: 'Mar 22',
//                         Apples: 2890,
//                         Oranges: 2338,
//                         Tomatoes: 2452,
//                     },
//                     {
//                         date: 'Mar 23',
//                         Apples: 2756,
//                         Oranges: 2103,
//                         Tomatoes: 2402,
//                     },
//                 ]}
//                 dataKey="date"
//                 series={[
//                     { name: 'Apples', color: 'indigo.6' },
//                     { name: 'Oranges', color: 'blue.6' },
//                     { name: 'Tomatoes', color: 'teal.6' },
//                 ]}
//                 curveType="natural"
//             />
//         </Card>
//     );
// }

export default function DashBoard() {
    const [dashboard, setDashboard] = useState({
        posts_count: 0,
        like_count: 0,
        histories_count: 0,
    });

    const handleGetData = async () => {
        const data = await getDashboard();

        if (data) {
            setDashboard(data);
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <Box>
            <Title order={2} mb="md">
                Admin Dashboard
            </Title>
            <SimpleGrid cols={3} spacing="md">
                <StatCard title="Total Posts" value={dashboard.posts_count} icon={<IconFileText size={32} />} />
                <StatCard title="Views" value={dashboard.histories_count} icon={<IconEye size={32} />} />
                <StatCard title="Likes" value={dashboard.like_count} icon={<IconHeart size={32} color="red" />} />
            </SimpleGrid>
            {/* <SimpleGrid cols={1} spacing="md" mt="lg">
                <ChartCard title="Posts, Likes & Views Over Time" data={[]} />
                <ChartCard title="Likes & Views Trend" data={[]} />
                <ChartCard title="Likes & Views Trend" data={[]} />
            </SimpleGrid> */}
        </Box>
    );
}
