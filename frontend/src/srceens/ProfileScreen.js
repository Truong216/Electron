import { update, getMyOrders } from '../api';
import { getUserInfo, setUserInfo, clearUser } from '../localStorage';
import { showLoading, hideLoading, showMessage } from '../utils';

const ProfileScreen = {
  after_render: () => {
    document.getElementById('signout-button').addEventListener('click', () => {
      clearUser();
      document.location.hash = '/';
    });
    document
      .getElementById('profile-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const data = await update({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        });
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          setUserInfo(data);
          document.location.hash = '/';
        }
      });
  },
  render: async () => {
    const { name, email } = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }
    const orders = await getMyOrders();
    return `
    <div class="content profile">
      <div class="profile-info">
      <div class="form-container">
      <form id="profile-form">
        <ul class="form-items">
          <li>
            <h1>User Profile</h1>
          </li>
          <li>
            <label for="name">Tên</label>
            <input type="name" name="name" id="name" value="${name}" />
          </li>
          <li>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" value="${email}" />
          </li>
          <li>
            <label for="password">Mật Khẩu</label>
            <input type="password" name="password" id="password" />
          </li>
          <li>
            <button type="submit" class="primary">Cập Nhật</button>
          </li>
          <li>
          <button type="button" id="signout-button" >Đăng Xuất</button>
        </li>        
        </ul>
      </form>
    </div>
      </div>
      <div class="profile-orders">
      <h2>Order History</h2>
        <table>
          <thead>
            <tr>
              <th>Mã Đặt Hàng</th>
              <th>Ngày Đặt</th>
              <th>Tổng</th>
              <th>Thanh Toán</th>
              <th>Giao Hàng</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            ${
              orders.length === 0
                ? `<tr><td colspan="6">No Order Found.</tr>`
                : orders
                    .map(
                      (order) => `
          <tr>
            <td>${order._id}</td>
            <td>${order.createdAt}</td>
            <td>${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${order.totalPrice}`)}
            </td>
            <td>${order.paidAt || 'No'}</td>
            <td>${order.deliveryAt || 'No'}</td>
            <td><a href="/#/order/${order._id}">Chi Tiết</a> </td>
          </tr>
          `
                    )
                    .join('\n')
            }
          </tbody>
        </table>
      </div>
    </div>


    
    `;
  },
};
export default ProfileScreen;
