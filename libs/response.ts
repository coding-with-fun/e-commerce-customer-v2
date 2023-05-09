import _ from 'lodash';
import type { NextApiResponse } from 'next';
import { ZodError } from 'zod';

const response = (res: NextApiResponse, data?: any, error?: any) => {
    let success = _.get(data, 'success', true);
    let message = _.get(data, 'message', '');

    if (error instanceof ZodError) {
        message = _.get(
            error,
            'issues[0].message',
            'Error while validating the request.'
        );
        success = false;
        res.status(400);
    } else if (error instanceof Error) {
        message = _.get(error, 'message', 'Something went wrong.');
        success = false;
    }

    return res.json({
        ...data,
        success,
        message,
    });
};

export default response;
