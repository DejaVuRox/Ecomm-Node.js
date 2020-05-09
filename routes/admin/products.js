const express = require("express");
const multer = require("multer");

//Custom middleware
const { handleErrors, requireAuth } = require("./middleware");

//Repo
const productRepo = require("../../repo/products/products");

//Templates
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");

//Validators
const { requireTitle, requirePrice } = require("../../routes/admin/validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//Products Page
router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

//New Product Page
router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productRepo.create({ title, price, image }); //image removed

    res.redirect("/admin/products");
  }
);

//EDIT PRODUCT
router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productRepo.getOne(req.params.id);

  if (!product) {
    return res.send("Product not found");
  }

  res.send(productsEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }

    try {
      await productRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Could not find item");
    }

    res.redirect("/admin/products");
  }
);

router.post("/admin/products/:id/delete", requireAuth, async (req, res) => {
  await productRepo.delete(req.params.id)
  res.redirect("/admin/products");
});

module.exports = router;
