const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

// Product tag model allows us to associate a product with a tag. We connect an instance of this model to a product (thought product_id) and a tag (through tag_id).
class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // foreign key which references the product model's id. this allows us to associate a product with a tag.
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id',
      },
    },
    // foreign key which references the tag model's id. this allows us to associate a tag with a product.
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
