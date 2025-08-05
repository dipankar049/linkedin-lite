import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = parseInt(searchParams.get('skip')) || 0;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('comments.user', 'name');

    const formattedPosts = posts.map((post) => {
      const postObj = post.toObject();
      postObj.formattedCreatedAt = new Date(post.createdAt).toLocaleString();
      postObj.comments = postObj.comments.map((comment) => ({
        ...comment,
        formattedCreatedAt: new Date(comment.createdAt).toLocaleString(),
      }));
      return postObj;
    });

    return Response.json({ posts: formattedPosts });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
