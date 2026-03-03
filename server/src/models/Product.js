/**
 * Product Model
 *
 * Represents peanut butter variants.
 * Includes nutritional info, variants (sizes), and inventory.
 * Virtual field for average rating from Review model.
 */
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, 'Variant size is required'],
      enum: ['250g', '500g', '1kg'],
    },
    price: {
      type: Number,
      required: [true, 'Variant price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number, // original/MRP for showing discount
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { _id: true }
);

const nutritionSchema = new mongoose.Schema(
  {
    servingSize: { type: String, default: '32g (2 tbsp)' },
    calories: Number,
    protein: Number,
    totalFat: Number,
    saturatedFat: Number,
    carbohydrates: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['creamy', 'crunchy', 'chocolate', 'honey'],
    },
    ingredients: {
      type: [String],
      default: ['Roasted Peanuts', 'Sea Salt'],
    },
    nutrition: nutritionSchema,
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one variant is required',
      },
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    badges: [
      {
        type: String,
        enum: [
          'no-palm-oil',
          'no-vegetable-oil',
          'no-artificial-flavors',
          'high-protein',
          'gluten-free',
          'vegan',
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1 });

// Auto-generate slug from name before save
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual: reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

module.exports = mongoose.model('Product', productSchema);
