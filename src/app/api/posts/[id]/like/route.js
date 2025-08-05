import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req, context) {
  const { params } = await context;
  await dbConnect();
  const user = await getUserFromToken(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const postId = params.id;
  const post = await Post.findById(postId);
  if (!post) return Response.json({ error: 'Post not found' }, { status: 404 });

  const alreadyLiked = post.likes.includes(user._id);
  if (alreadyLiked) {
    post.likes.pull(user._id);
  } else {
    post.likes.push(user._id);
  }

  await post.save();
  return Response.json({ liked: !alreadyLiked, totalLikes: post.likes.length });
}