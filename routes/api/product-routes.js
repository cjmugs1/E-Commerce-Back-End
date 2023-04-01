const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// error codes:
// 200 - OK
// 400 - Bad post request
// 404 - Bad delete/put request
// 500 - Bad get request

// find all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: { attributes: [] } }
      ],
    });
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  };
});

// find one product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }]
    });

    if (!singleProduct) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json(singleProduct);
  } catch (err) {
    res.status(500).json(err);
  };
});

// create new product
router.post('/', async (req, res) => {

  /* req.body should look like this:
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 1,
      associatedTagIds: [1, 2, 3, 4]
    }
    !! the user must include valid tag ids in the associatedTagIds array. that way the the ProductTag will be associated with the correct tags.
  */

  try {
    const newProduct = await Product.create(req.body);

    if(req.body.associatedTagIds.length) {
    // map the associatedTagIds array from the request to an array of objects that can be used to create the ProductTag instances
      const associatedTags = req.body.associatedTagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });

      for (let i = 0; i < associatedTags.length; i++) {
        let currentTag = await Tag.findByPk(associatedTags[i].tag_id);
        if (!currentTag) {
          res.status(400).json({ message: 'Invalid tag id in associatedTags array' });
          return;
        }
      }

      return ProductTag.bulkCreate(associatedTags);
    }

    res.status(200).json(newProduct);

  } catch (err) {
    res.status(400).json(err);
  };
});

// update product and associated tags
router.put('/:id', async (req, res) => {
  try {
    try {
      const updatedProduct = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!updatedProduct) {
        res.status(404).json({ message: 'No product found with that id!' });
        return;
      };

    } catch (err) {
      res.status(404).json(err);
    }
    
    if (req.body.associatedTagIds.length) {
      // find all current associated ProductTags to the product we are updating
      const associatedProductTags = await ProductTag.findAll({ where: { product_id: req.params.id } })

      // map the current associated ProductTag ids into a new array, which we can use to compare to the request for the new associated tag ids.
      const associatedProductTagIds = await associatedProductTags.map(({ tag_id }) => tag_id);

      // filter the newly requested associatedTagIds array to only include the ids that are not already associated with the product
      const newProductTags = await req.body.associatedTagIds
        .filter((tag_id) => !associatedProductTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id
          };
        });

      // filter the newly requested associatedTagIds array to only include the ids that are already associated with the product
      const productTagsToRemove = await associatedProductTagIds
        .filter(({ tag_id }) => !req.body.associatedTagIds.includes(tag_id))
        .map(({ id }) => id);

      ProductTag.destroy({ where: { id: productTagsToRemove } })
      ProductTag.bulkCreate(newProductTags)
    }

    res.status(200).json("ProductTags updated!");

  } catch (err) {
    res.status(404).json(err);
  }
});

  // delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    })

    if(!deletedProduct) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    };

    res.status(200).json(deletedProduct);
    
  } catch (err) {
    res.status(404).json(err);
  };
});

module.exports = router;
