// /api/users/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { params } = await context;
    const { id } = params;

    const user = await User.findById(id).select('name email bio');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    // Fetch posts and populate author and comments.user
    const rawPosts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .populate('comments.user', 'name email');

    // Return raw createdAt as ISO strings so PostCard can format them
    const posts = rawPosts.map((post) => ({
      _id: post._id,
      content: post.content,
      likes: post.likes,
      author: post.author,
      createdAt: post.createdAt.toISOString(), // use this instead of formatted
      comments: post.comments.map((c) => ({
        _id: c._id,
        user: c.user,
        text: c.text,
        createdAt: c.createdAt.toISOString(), // keep raw ISO
      })),
    }));

    return Response.json({ user, posts });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}