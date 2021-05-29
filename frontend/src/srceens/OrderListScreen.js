import DashboardMenu from '../components/DashboardMenu';
import { getOrders, deleteOrder } from '../api';
import { showLoading, hideLoading, rerender, showMessage } from '../utils';

const OrderListScreen = {
  after_render: () => {
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure to delete this order?')) {
          showLoading();
          const data = await deleteOrder(deleteButton.id);
          if (data.error) {
            showMessage(data.error);
          } else {
            rerender(OrderListScreen);
          }
          hideLoading();
        }
      });
    });
    const editButtons = document.getElementsByClassName('edit-button');
    Array.from(editButtons).forEach((editButton) => {
      editButton.addEventListener('click', async () => {
        document.location.hash = `/order/${editButton.id}`;
      });
    });
  },
  render: async () => {
    const orders = await getOrders();
    return `
    <div class="dashboard">
    ${DashboardMenu.render({ selected: 'orders' })}
    <div class="dashboard-content">
      <h1>Đặt Hàng</h1>
       
      <div class="order-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Tài Khoản</th>
              <th>Thanh Toán</th>
              <th>Giao Hàng</th>
              <th class="tr-action">Tùy Chọn</th>
            <tr>
          </thead>
          <tbody>
            ${orders
              .map(
                (order) => `
            <tr>
              <td>${order._id}</td>
              <td>${order.createdAt}</td>
              <td>${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(`${order.totalPrice}`)}</td>
              <td>${order.user.name}</td>
              <td>${order.paidAt || 'No'}</td>
              <td>${order.deliveredAt || 'No'}</td>
              <td>
              <button id="${order._id}" class="edit-button">Sửa</button>
              <button id="${order._id}" class="delete-button">Xóa</button>
              </td>
            </tr>
            `
              )
              .join('\n')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
    `;
  },
};
export default OrderListScreen;
