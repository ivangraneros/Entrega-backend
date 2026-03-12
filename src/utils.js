import bcrypt from 'bcrypt';

const salt = 10

export const createHash = password => bcrypt.hashSync(password, salt)

export const validatePassword = (user, password) => {

    if (!password || !user?.password) {
        return false
    }
    return bcrypt.compareSync(password, user.password)

};