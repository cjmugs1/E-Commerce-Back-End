const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// error codes:
// 200 - OK
// 400 - Bad post request
// 404 - Bad delete/put request
// 500 - Bad get request

// find all categories
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  };

});

// find one category by its `id`
router.get('/:id', async (req, res) => {
  try {
    const singleCategory = await Category.findByPk(req.params.id, {
      include: [{ model: Product }] 
    });

    if (!singleCategory) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(singleCategory);
  } catch (err) {
    res.status(500).json(err);
  };
});

// create a new category
router.post('/', async (req, res) => {

  /* req.body should look like this:
   {
     "category_name": "Shirts"
   }
  */

  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  };
});

// update a category by its `id`
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedCategory) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    };

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(404).json(err);
  };
});

// delete a category by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    };

    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(404).json(err);
  };
});

module.exports = router;
