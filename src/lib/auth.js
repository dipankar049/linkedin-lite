import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from './dbConnect';

export async function getUserFromToken(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) return null;

    const user = await User.findById(decoded.userId).select('-password');
    return user || null;
  } catch (err) {
    console.error('Token verification error:', err.message);
    return null;
  }
}