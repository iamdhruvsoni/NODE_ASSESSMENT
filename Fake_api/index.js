const express = require("express");
const app = express();
const axios = require("axios");

app.set("view engine", "ejs");
app.use(express.static("public"));


function paginate(items, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}

app.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const itemsPerPage = 10; // Number of items per page

  axios
    .get("https://fakestoreapi.com/products/")
    .then((response) => {
      const products = response.data;
      if (products && products.length > 0) {
        const paginatedProducts = paginate(products, page, itemsPerPage);
        const totalPages = Math.ceil(products.length / itemsPerPage);
        res.render("home", {
          products: paginatedProducts,
          currentPage: page,
          totalPages: totalPages,
        });
      } else {
        res.send("No products found...");
      }
    })
    .catch((err) => {
      res.status(500).send("Error fetching products.");
    });
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
