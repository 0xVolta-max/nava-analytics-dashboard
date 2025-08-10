export const mockData = {
    analyses: {
        current: 12500,
        previous: 11600,
        trend: [4200, 5100, 4800, 5300, 4900, 5800, 6200, 5400, 6100, 5700, 6300, 6800, 7200, 6900, 7500, 7100, 7800, 8200, 7900, 8500, 8100, 8800, 9200, 8900, 9500, 9100, 9800, 10200, 11500, 12500]
    },
    videos: {
        current: 1800,
        previous: 1470,
        trend: [580, 620, 650, 580, 700, 750, 680, 720, 760, 690, 780, 820, 750, 850, 890, 820, 920, 960, 880, 1000, 1040, 960, 1100, 1140, 1080, 1200, 1240, 1180, 1350, 1800]
    },
    scripts: {
        current: 8900,
        previous: 9100,
        trend: [3200, 3500, 3100, 3400, 3300, 3600, 3400, 3700, 3500, 3800, 3600, 3900, 3700, 4000, 3800, 4100, 3900, 4200, 4000, 4300, 4100, 4400, 4200, 4500, 4300, 4600, 4400, 4700, 4500, 8900]
    }
};

export const platformData = {
    labels: ['TikTok', 'YouTube', 'Instagram'],
    datasets: [{
        data: [45, 35, 20],
        backgroundColor: ['#ff4500', '#ff6b35', '#ff7f50'],
        borderWidth: 0
    }]
};

export const nicheData = {
    labels: ['Fitness', 'Tech', 'Food', 'Travel', 'Fashion', 'Gaming', 'Music', 'Education'],
    datasets: [{
        label: 'High Performing',
        data: [850, 720, 680, 590, 540, 480, 420, 380],
        backgroundColor: '#4ade80',
        borderRadius: 4
    }, {
        label: 'Average',
        data: [320, 280, 260, 240, 220, 200, 180, 160],
        backgroundColor: '#fbbf24',
        borderRadius: 4
    }]
};