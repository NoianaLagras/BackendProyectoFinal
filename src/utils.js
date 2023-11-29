import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import jwt from 'jsonwebtoken';
export default __dirname;

export const hashData =  async (data) => {
    return bcrypt.hash(data ,10)
}
export const compareData = async (data , hashedData)=>{
    return bcrypt.compare(data,hashedData)
}
const SECRET_KET_JWT = 'secretJWT'
export const generateToken = (user)=>{
    const token = jwt.sign(user,SECRET_KET_JWT,{ expiresIn:300 });
    return token ;
}