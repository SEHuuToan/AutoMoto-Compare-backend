import jwt, { TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY as string;
const secretKey = process.env.JWT_SECRET_KEY as string;

const generateAccessToken = (
  username: string,
  role: string,
  id: string,
): string => {
  const accesstoken = jwt.sign({ username }, secretKey, { expiresIn: '45m' }); // Thời gian hết hạn là 45phut
  return accesstoken;
};
const generateRefreshToken = (
  username: string,
  role: string,
  id: string,
): string => {
  const refreshToken = jwt.sign({ username }, refreshSecretKey, {
    expiresIn: '1d',
  }); // Thời gian hết hạn là 1 ngay
  return refreshToken;
};
const verifyToken = (token: string, type: 'access' | 'refresh'): any => {
  try {
    const secret = type === 'access' ? secretKey : refreshSecretKey;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw error;
  }
};
export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  refreshSecretKey,
};
