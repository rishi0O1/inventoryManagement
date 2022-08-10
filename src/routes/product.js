const express = require("express");
const router = express.Router();
const Product = require("../db/model/product");
const roles = require("../db/model/role.enum");
const auth = require("../middleware/auth");
const authorization  = require("../middleware/authrisation");

router.use(auth);
router.get("/product", (req, res) => {
  const filter = {};
  const sortBy = {};
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;

  // console.log("limit : " , limit) ;
  // console.log(skip) ;
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.orderBy) {
    filter[req.query.orderBy] = {
      $gte: parseInt(req.query.gt || 0),
    };
    if (parseInt(req.query.lt)) {
      filter[req.query.orderBy].append({
        $lte: parseInt(req.query.lt),
      });
    }
  }
  if(req.query.sold && !req.user.customer){
    filter.sold = true ;
  }
  if (req.user.role == roles.customer) {
    filter.isSold = false;
    filter.isDelisted = false;
  }
  if (req.query.sortBy) {
    let sortParam = req.query.sortBy;
    let order = req.query.order || "asc";
    sortBy[sortParam] = order;
  }
  console.log(filter);
  console.log(sortBy);
  const products = Product.find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .then((products) => {
      res.send(products);
    })
    .catch((e) => {
      console.log(e);
    });
});

router.post("/product", authorization(roles.owner), async (req, res) => {
  const newProduct = new Product({ ...req.body });
  try {
    await newProduct.save();
    res.status(201).send({
      message: "successfully created the product",
      data: newProduct,
    });
  } catch (e) {
    res.send(400).send({
      message: "unable to create the product",
    });
  }
});

// buy the product
router.get("/product/:id", authorization(roles.customer), async (req, res) => {
  const id = req.params.id ;
  try{
    const product = await Product.findById(id) ;
    if(!product){
      res.status(501).send({
        message: "no product found with this ID" ,
      })
    }
    product.isSold = true ;
    product.buyer = req.user._id ;
    await product.save() ;
    res.send({
      message: "successfully buy the product " + product ,
    });
  } catch(e) {
    res.status(501).send({
      "message": "unable to buy the product" + e ,
    })
  }
});

// delist the product
router.get("/product/:id/delist", authorization(roles.owner , roles.manager), async (req, res) => {
  const id = req.params.id ;
  try{
    const product = await Product.findById(id) ;
    if(!product){
      res.status(501).send({
        message: "no product found with this ID" ,
      })
    }
    product.isDelisted = true ;
    await product.save() ;
    res.send({
      message: "successfully buy the product " + product ,
    });
  } catch(e) {
    res.status(501).send({
      "message": "unable to buy the product" + e ,
    })
  }
});

module.exports = router;
