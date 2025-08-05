import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req, context) {
  const { params } = await context;
  await dbConnect();

  const user = await getUserFromToken(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { text } = body;

  const post = await Post.findById(params.id);
  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 });
  }

  // Add comment
  post.comments.push({
    user: user._id,
    text,
    createdAt: new Date(),
  });

  await post.save();

  // Populate the last added comment's user field
  const populatedPost = await Post.findById(post._id)
    .populate('comments.user', 'name');

  const newComment = populatedPost.comments[populatedPost.comments.length - 1];

  return Response.json({
    message: 'Comment added',
    comment: newComment,
    totalComments: populatedPost.comments.length,
  });
}
