const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');

const seedData = async () => {
  try {
    console.log('🌱 Seeding initial data...');

    // Create a dummy user
    const user = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      bio: 'Administrator of the Blog Platform',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    });

    // Create some dummy posts
    await Post.create([
      {
        title: 'Welcome to our New Blog Platform!',
        content: 'We are excited to launch this new platform where you can share your thoughts and stories with the world. Stay tuned for more updates and features! This is a long content to satisfy the 20 characters requirement.',
        excerpt: 'The beginning of a new journey in blogging.',
        author: user._id,
        tags: ['welcome', 'news'],
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'
      },
      {
        title: 'The Art of Writing',
        content: 'Writing is not just about words; it is about conveying emotions and ideas. In this post, we explore how to find your voice. This is a long content to satisfy the 20 characters requirement.',
        excerpt: 'Finding your voice in a crowded digital space.',
        author: user._id,
        tags: ['writing', 'creativity'],
        coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000'
      },
      {
        title: 'Mastering Full-Stack Development',
        content: 'From frontend to backend, mastering the full stack requires patience and practice. Here are our top tips for 2024. This is a long content to satisfy the 20 characters requirement.',
        excerpt: 'Become a versatile developer in the modern era.',
        author: user._id,
        tags: ['tech', 'development'],
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000'
      }
    ]);

    console.log('✅ Seeding completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
};

module.exports = seedData;
