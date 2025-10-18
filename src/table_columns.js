
import { Tag } from "antd";

const columns = [
    {
        title: 'Part',
        dataIndex: 'part',
        key: 'part',
        width: '20%'
    },
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        width: '10%',
        render: (_, { rank }) => {
            let color;

            if (rank === 1) {
                color = 'gold';
            } else if (rank <= 3) {
                color = 'purple';
            } else if (rank <= 5) {
                color = 'geekblue';
            } else if (rank <= 10) {
                color = 'green';
            } else if (rank <= 20) {
                color = 'orange';
            } else {
                color = 'red';
            }

            return (
                <Tag color={color} key={rank}>
                    {rank}
                </Tag>
            );
        },
    },
    {
        title: 'Brand',
        dataIndex: 'brand',
        key: 'brand',
        width: '50%',


    },



    {
        title: 'Avg Price ($)',
        dataIndex: 'price',
        key: 'price',
        width: '20%'
    },
];

export default columns;