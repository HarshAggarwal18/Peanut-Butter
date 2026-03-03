/**
 * Database Seeder
 *
 * Seeds the database with sample products and an admin user.
 * Run: npm run seed
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');

const connectDB = require('../config/db');

const sampleProducts = [
  {
    name: 'Classic Creamy Peanut Butter',
    tagline: 'Silky smooth. Pure protein. Zero compromise.',
    description:
      'Our signature creamy peanut butter made from slow-roasted peanuts and a pinch of Himalayan sea salt. No palm oil, no vegetable oils, no artificial flavors. Just 100% real peanut goodness with 30g protein per 100g.',
    category: 'creamy',
    ingredients: ['Slow-Roasted Peanuts (98%)', 'Himalayan Sea Salt'],
    nutrition: {
      servingSize: '32g (2 tbsp)',
      calories: 190,
      protein: 9.6,
      totalFat: 16,
      saturatedFat: 2.5,
      carbohydrates: 6,
      fiber: 2,
      sugar: 1.5,
      sodium: 95,
    },
    variants: [
      { size: '250g', price: 299, compareAtPrice: 399, stock: 100 },
      { size: '500g', price: 549, compareAtPrice: 699, stock: 75 },
      { size: '1kg', price: 999, compareAtPrice: 1299, stock: 50 },
    ],
    images: [
      {
        url: '/images/creamy-front.jpg',
        alt: 'Classic Creamy Peanut Butter - Front',
        isPrimary: true,
      },
      {
        url: '/images/creamy-side.jpg',
        alt: 'Classic Creamy Peanut Butter - Nutrition Label',
      },
    ],
    badges: [
      'no-palm-oil',
      'no-vegetable-oil',
      'no-artificial-flavors',
      'high-protein',
      'gluten-free',
      'vegan',
    ],
    featured: true,
    ratingsAverage: 4.8,
    ratingsCount: 127,
  },
  {
    name: 'Crunchy Peanut Butter',
    tagline: 'Bold crunch. Clean fuel. Every single bite.',
    description:
      'Perfectly roasted peanut chunks folded into our signature base. The crunch you crave, the nutrition you need. 28g protein per 100g with zero junk ingredients.',
    category: 'crunchy',
    ingredients: ['Slow-Roasted Peanuts (98%)', 'Himalayan Sea Salt'],
    nutrition: {
      servingSize: '32g (2 tbsp)',
      calories: 188,
      protein: 8.9,
      totalFat: 15.5,
      saturatedFat: 2.3,
      carbohydrates: 6.5,
      fiber: 2.5,
      sugar: 1.3,
      sodium: 90,
    },
    variants: [
      { size: '250g', price: 299, compareAtPrice: 399, stock: 100 },
      { size: '500g', price: 549, compareAtPrice: 699, stock: 75 },
      { size: '1kg', price: 999, compareAtPrice: 1299, stock: 50 },
    ],
    images: [
      {
        url: '/images/crunchy-front.jpg',
        alt: 'Crunchy Peanut Butter - Front',
        isPrimary: true,
      },
    ],
    badges: [
      'no-palm-oil',
      'no-vegetable-oil',
      'no-artificial-flavors',
      'high-protein',
      'gluten-free',
      'vegan',
    ],
    featured: true,
    ratingsAverage: 4.7,
    ratingsCount: 98,
  },
  {
    name: 'Dark Chocolate Peanut Butter',
    tagline: 'Indulgent flavor. Athlete-approved nutrition.',
    description:
      'Rich dark cocoa blended with premium roasted peanuts. Tastes like dessert, performs like fuel. 25g protein per 100g with no added sugar.',
    category: 'chocolate',
    ingredients: [
      'Slow-Roasted Peanuts (90%)',
      'Dark Cocoa Powder (8%)',
      'Himalayan Sea Salt',
    ],
    nutrition: {
      servingSize: '32g (2 tbsp)',
      calories: 185,
      protein: 8,
      totalFat: 14.5,
      saturatedFat: 3,
      carbohydrates: 8,
      fiber: 2.5,
      sugar: 2,
      sodium: 85,
    },
    variants: [
      { size: '250g', price: 349, compareAtPrice: 449, stock: 80 },
      { size: '500g', price: 649, compareAtPrice: 799, stock: 60 },
      { size: '1kg', price: 1149, compareAtPrice: 1399, stock: 40 },
    ],
    images: [
      {
        url: '/images/chocolate-front.jpg',
        alt: 'Dark Chocolate Peanut Butter - Front',
        isPrimary: true,
      },
    ],
    badges: [
      'no-palm-oil',
      'no-vegetable-oil',
      'no-artificial-flavors',
      'high-protein',
      'gluten-free',
    ],
    featured: true,
    ratingsAverage: 4.9,
    ratingsCount: 64,
  },
  {
    name: 'Honey Peanut Butter',
    tagline: 'Nature\'s sweetness meets pure peanut power.',
    description:
      'Wild forest honey stirred into slow-roasted peanuts. A subtle sweetness that lets the peanut flavor shine. 26g protein per 100g, naturally sweetened.',
    category: 'honey',
    ingredients: [
      'Slow-Roasted Peanuts (92%)',
      'Wild Forest Honey (6%)',
      'Himalayan Sea Salt',
    ],
    nutrition: {
      servingSize: '32g (2 tbsp)',
      calories: 192,
      protein: 8.3,
      totalFat: 15,
      saturatedFat: 2.4,
      carbohydrates: 8.5,
      fiber: 2,
      sugar: 4,
      sodium: 80,
    },
    variants: [
      { size: '250g', price: 329, compareAtPrice: 429, stock: 70 },
      { size: '500g', price: 599, compareAtPrice: 749, stock: 55 },
      { size: '1kg', price: 1099, compareAtPrice: 1349, stock: 35 },
    ],
    images: [
      {
        url: '/images/honey-front.jpg',
        alt: 'Honey Peanut Butter - Front',
        isPrimary: true,
      },
    ],
    badges: [
      'no-palm-oil',
      'no-vegetable-oil',
      'no-artificial-flavors',
      'high-protein',
      'gluten-free',
    ],
    featured: false,
    ratingsAverage: 4.6,
    ratingsCount: 42,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    console.log('Cleared existing data.');

    // Create admin user
    const admin = await User.create({
      name: 'PB Brand Admin',
      email: 'admin@pbbrand.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log(`✓ Admin created: ${admin.email}`);

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
    console.log(`✓ Sample user created: ${user.email}`);

    // Create products (use create() loop to trigger pre-save hooks like slug generation)
    const products = [];
    for (const p of sampleProducts) {
      products.push(await Product.create(p));
    }
    console.log(`✓ ${products.length} products seeded.`);

    // Create sample reviews
    const sampleReviews = [
      {
        user: user._id,
        product: products[0]._id,
        rating: 5,
        title: 'Best peanut butter I\'ve ever had',
        comment:
          'The texture is incredibly smooth and the taste is pure peanut. No weird aftertaste like other brands. My post-workout go-to now.',
        isVerifiedPurchase: true,
      },
      {
        user: admin._id,
        product: products[1]._id,
        rating: 5,
        title: 'Perfect crunch, clean ingredients',
        comment:
          'Finally a peanut butter that doesn\'t use palm oil. The peanut chunks are perfectly sized and the flavor is outstanding.',
        isVerifiedPurchase: true,
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log(`✓ ${sampleReviews.length} reviews seeded.`);

    console.log('\n✓ Database seeded successfully!');
    console.log('\nCredentials:');
    console.log('  Admin: admin@pbbrand.com / admin123456');
    console.log('  User:  john@example.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
