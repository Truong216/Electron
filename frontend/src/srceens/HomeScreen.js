import axios from 'axios';
import Rating from '../components/Rating';
import { getProducts } from '../api';

const HomeScreen = {
  render: async () => {
    const products = await getProducts();
    if (products.error) {
      return `<div class="error">${products.error}</div>`;
    }

    return `
    <ul class="products">
      ${products
        .map(
          (product) => `
      <li>
        <div class="product">
          <a href="/#/product/${product._id}">
            <img src="${product.image}" alt="${product.name}" width="300" height="280"/>
          </a>
        <div class="product-name">
          <a href="/#/product/1">
            ${product.name}
          </a>
        </div>
        <div class="product-rating">
          ${Rating.render({
            value: product.rating,
            text: `${product.numReviews} Bình Luận`,
          })}
        </div>
        <div class="product-brand">
          ${product.brand}
        </div>
        <div class="product-price">
        ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${product.price}`)}
        </div>
        </div>
      </li>
      `
        )
        .join('\n')}
    `;
  },
};
export default HomeScreen;