import {
  parseRequestUrl,
  showLoading,
  hideLoading,
  showMessage,
  rerender,
} from '../utils';
import { getOrder, getPaypalClientId, payOrder, deliverOrder } from '../api';
import { getUserInfo } from '../localStorage';

const addPaypalSdk = async (totalPrice) => {
  const clientId = await getPaypalClientId();
  showLoading();
  if (!window.paypal) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypalobjects.com/api/checkout.js';
    script.async = true;
    script.onload = () => handlePayment(clientId, totalPrice);
    document.body.appendChild(script);
  } else {
    handlePayment(clientId, totalPrice);
  }
};
const handlePayment = (clientId, totalPrice) => {
  window.paypal.Button.render(
    {
      env: 'sandbox',
      client: {
        sandbox: clientId,
        production: '',
      },
      locale: 'en_US',
      style: {
        size: 'responsive',
        color: 'gold',
        shape: 'pill',
      },

      commit: true,
      payment(data, actions) {
        return actions.payment.create({
          transactions: [
            {
              amount: {
                total: totalPrice,
                currency: 'USD',
              },
            },
          ],
        });
      },
      onAuthorize(data, actions) {
        return actions.payment.execute().then(async () => {
          showLoading();
          await payOrder(parseRequestUrl().id, {
            orderID: data.orderID,
            payerID: data.payerID,
            paymentID: data.paymentID,
          });
          hideLoading();
          showMessage('Thanh Toán Thành Công', () => {
            rerender(OrderScreen);
          });
        });
      },
    },
    '#paypal-button'
  ).then(() => {
    hideLoading();
  });
};
const OrderScreen = {
  after_render: async () => {
    const request = parseRequestUrl();
    if (document.getElementById('deliver-order-button')) {
      document.addEventListener('click', async () => {
        showLoading();
        await deliverOrder(request.id);
        hideLoading();
        // showMessage('Đã Xác Nhận Giao Hàng', () => {
          rerender(OrderScreen);
        // });
      });
    }
  },
  render: async () => {
    const { isAdmin } = getUserInfo();
    const request = parseRequestUrl();
    const {
      _id,
      shipping,
      payment,
      orderItems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isDelivered,
      deliveredAt,
      isPaid,
      paidAt,
    } = await getOrder(request.id);
    const tien = totalPrice/1000;
    if (!isPaid) {
      addPaypalSdk(tien.toFixed(2));
      console.log(tien)
    }
    return `
    <div>
    <h1>Order ${_id}</h1>
      <div class="order">
        <div class="order-info">
          <div>
            <h2>Shipping</h2>
            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode}, 
            ${shipping.country}
            </div>
            ${
              isDelivered
                ? `<div class="success">Giao Hàng Lúc ${deliveredAt}</div>`
                : `<div class="error">Chưa Giao Hàng </div>`
            }
             
          </div>
          <div>
            <h2>Payment</h2>
            <div>
              Phương Thức Thanh Toán : ${payment.paymentMethod}
            </div>
            ${
              isPaid
                ? `<div class="success">Thanh Toán Lúc${paidAt}</div>`
                : `<div class="error">Chưa Thanh Toán</div>`
            }
          </div>
          <div>
            <ul class="cart-list-container">
              <li>
                <h2>Giỏ Đồ</h2>
                <div>Giá</div>
              </li>
              ${orderItems
                .map(
                  (item) => `
                <li>
                  <div class="cart-image">
                    <img src="${item.image}" alt="${item.name}" />
                  </div>
                  <div class="cart-name">
                    <div>
                      <a href="/#/product/${item.product}">${item.name} </a>
                    </div>
                    <div> Qty: ${item.qty} </div>
                  </div>
                  <div class="cart-price">
                  ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${item.price}`)}
                  </div>
                </li>
                `
                )
                .join('\n')}
            </ul>
          </div>
        </div>
        <div class="order-action">
           <ul>
                <li>
                  <h2>Đơn đặt hàng</h2>
                 </li>
                 <li><div>Items</div><div>
                 ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${itemsPrice}`)}
                 </div></li>
                 <li><div>Shipping</div><div>
                 ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${shippingPrice}`)}
                 </div></li>
                 <li><div>Tax</div><div>
                 ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${taxPrice}`)}
                 </div></li>
                 <li class="total"><div>Tổng Chi Phí</div><div>
                 ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${totalPrice}`)}
                 </div></li>                  
                 <li><div class="fw" id="paypal-button"></div></li>
                 <li>
                 ${
                   isPaid && !isDelivered && isAdmin
                     ? `<button id="deliver-order-button" class="primary fw">Giao Hàng</button>`
                     : ''
                 }
                 <li>
        </div>
      </div>
    </div>
    `;
  },
};
export default OrderScreen;
