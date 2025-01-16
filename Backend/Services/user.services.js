import userModel from '../models/user.model.js';

async function createUser({ firstname, lastname, email, password }) {
    if (!firstname) throw new Error('Firstname is required');
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const user = await userModel.create({
        fullname: { firstname, lastname },
        email,
        password,
    });
    return user;
}

export default { createUser };
