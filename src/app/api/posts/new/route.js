import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { content } = await req.json();
    if (!content) {
      return Response.json({ error: 'Post content is required' }, { status: 400 });
    }

    const post = await Post.create({
      content,
      author: decoded.userId,
    });

    return Response.json({ message: 'Post created', post });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
