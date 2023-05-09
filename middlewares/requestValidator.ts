import type { NextApiRequest } from 'next';
import { type AnyZodObject, type ZodEffects } from 'zod';

const requestValidator = async (
    req: NextApiRequest,
    schema: ZodEffects<AnyZodObject> | AnyZodObject
) => {
    try {
        let parsedResponse = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
        });

        if (!parsedResponse.success) {
            throw parsedResponse.error;
        }

        return parsedResponse.data;
    } catch (error) {
        console.log(
            '------------------------------------------------------------'
        );
        console.log('Error while validating the request...');
        console.log(JSON.stringify(error, null, 2));
        console.log(
            '------------------------------------------------------------'
        );

        throw error;
    }
};

export default requestValidator;
