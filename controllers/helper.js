export const maxAge = 1 * 24 * 60 * 60


export const createToken = (id, email) => {
    return jwt.sign({ id, email }, tokenKey, { expiresIn: maxAge * 1000 });
};
