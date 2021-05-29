import { parseRequestUrl, showLoading, hideLoading } from '../utils';
import { getProduct } from '../api';
import Rating from '../components/Rating';

const ProductScreen = {
  after_render: () => {
    const request = parseRequestUrl();
    document.getElementById('add-button').addEventListener('click', () => {
      document.location.hash = `/cart/${request.id}`;
    });
  },
  render: async () => {
    const request = parseRequestUrl();
    showLoading();
    const product = await getProduct(request.id);
    if (product.error) {
      return `<div>${product.error}</div>`;
    }
    hideLoading();
    return `
    <div class="content">
      <div class="back-to-result">
        <a href="/#/">Trở Về Trang Chủ</a>
      </div>
      <div class="details">
        <div class="details-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="details-info">
          <ul>
            <li>
              <h1>${product.name}</h1>
            </li>
            <li>
            ${Rating.render({
              value: product.rating,
              text: `${product.numReviews} Bình Luận`,
            })}
            </li>
            <li>
              Giá: <strong>${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${product.price}`)}</strong>
            </li>
            <li>
              Miêu Tả:
              <div>
                ${product.description}
              </div>
            </li>
          </ul>
        </div>
        <div class="details-action">
            <ul>
              <li>
                giá: ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${product.price}`)}
              </li>
              <li>
                Status : 
                  ${
                    product.countInStock > 0
                      ? `<span class="success">Còn Hàng</span>`
                      : `<span class="error">Hết Hàng</span>`
                  }
              </li>
              <li>
                  <button id="add-button" class="fw primary">Thêm Vào Giỏ Đồ</div>
            </ul>
        </div>
      </div>
    </div>`;
  },
};
export default ProductScreen;
