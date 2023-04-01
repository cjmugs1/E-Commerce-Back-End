const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// error codes:
// 200 - OK
// 400 - Bad post request
// 404 - Bad delete/put request
// 500 - Bad get request

// find all tags
router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [{ model: Product }]
    })

    res.status(200).json(allTags)

  } catch (err) {
    res.status(500).json(err)
  };
});

// find one tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const singleTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!singleTag) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(singleTag);

  } catch (err) {
    res.status(500).json(err)
  };
});

// create a new tag
router.post('/', async (req, res) => {

  /* the user can add associated products to attach the new tag to in the request.
    the request body should look like this:
    {
      "tag_name": "blue",
      "associatedProductIds": [3, 2, 5]
    }
    !! the user must include valid product ids in the associatedProducts array. that way the the ProductTag will be associated with the correct products.
  */
  
  try {
    const newTag = await Tag.create(req.body);

    if (req.body.associatedProductIds.length) {
      // map the associatedProductIds array from the request to an array of objects that can be used to create the ProductTag instances
      const associatedProducts = req.body.associatedProductIds.map((product_id) => {
        return {
          product_id,
          tag_id: newTag.id,
        };
      });

      // check to make sure that all of the ids in the associatedProducts array are valid product ids
      for (let i = 0; i < associatedProducts.length; i++) {
        let currentProduct = await Product.findByPk(associatedProducts[i].product_id);
        if (!currentProduct) {
          res.status(400).json({ message: 'Invalid product id in associatedProducts array' });
          return;
        }
      }

      return ProductTag.bulkCreate(associatedProducts);
    }

    res.status(200).json(newTag);

  } catch (err) {
    res.status(400).json(err)
  };
});

// update a tag's name by its `id`
router.put('/:id', async (req, res) => {
  try {
    try {
      const updatedTag = await Tag.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!updatedTag) {
        res.status(404).json({ message: 'No tag found with that id!' });
        return;
      };

    } catch (err) {
      res.status(404).json(err);
    }
    
    // check to see if the request body for updating the tag includes an associatedProductIds array
    // if it does, we need to update the ProductTag table to reflect the new associated products
    if (req.body.associatedProductIds.length) {
      // find all current associated ProductTags to the tag we are updating
      const associatedProductTags = await ProductTag.findAll({ where: { tag_id: req.params.id } })

      // map the current associated ProductTag ids into a new array, which we can use to compare to the request for the new associated product ids.
      const associatedProductTagIds = await associatedProductTags.map(({ product_id }) => product_id);

      // filter the newly requested associatedProductIds array to only include the ids that are not already associated with the tag
      const newProductTags = await req.body.associatedProductIds
        .filter((product_id) => !associatedProductTagIds.includes(product_id))
        .map((product_id) => {
          return {
            product_id,
            tag_id: req.params.id
          };
        });

      // filter the newly requested associatedProductIds array to only include the ids that are already associated with the tag
      const productTagsToRemove = await associatedProductTagIds
        .filter(({ product_id }) => !req.body.associatedProductIds.includes(product_id))
        .map(({ id }) => id);

      ProductTag.destroy({ where: { id: productTagsToRemove } })
      ProductTag.bulkCreate(newProductTags)
    }

    res.status(200).json("ProductTags updated!");

  } catch (err) {
    res.status(404).json(err);
  }
});

// delete a tag by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })

    if (!deletedTag) {
      res.status(404).json("No tag with that id!")
      return;
    };

    res.status(200).json(deletedTag);

  } catch (err) {
    res.status(404).json(err)
  }
});

module.exports = router;
