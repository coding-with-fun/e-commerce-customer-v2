import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const encryptPassword = (plainPassword: string) => {
    return bcrypt.hashSync(plainPassword, salt);
};
