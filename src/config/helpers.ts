import * as bcrypt from 'bcrypt';

export const salt = bcrypt.genSaltSync(10);