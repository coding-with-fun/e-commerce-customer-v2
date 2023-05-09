import type { NextApiRequest } from 'next';

const pagination = (req: NextApiRequest) => {
    let page = +((req.query.page as string) ?? 1);
    if (page < 1) {
        page = 1;
    }

    let perPage = +((req.query.perPage as string) ?? 10);
    if (perPage < 1) {
        perPage = 10;
    }

    const query = (req.query.query as string) ?? '';

    return {
        page,
        perPage,
        query,
    };
};

export default pagination;
