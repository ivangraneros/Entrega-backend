import bcrypt from 'bcrypt';

const salt = 10

export const createHash = password => bcrypt.hashSync(password, salt)

export const validatePassword = (password, hash) => bcrypt.compareSync(password, hash)