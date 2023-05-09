import { encryptPassword } from '@/utils/password';

const SELLER = {
    name: 'Dev Harrsh Patel',
    profilePicture:
        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
    email: 'dev@harrsh.com',
    contactNumber: '+919099976321',
    password: encryptPassword('Abcd'),
};

export default SELLER;
