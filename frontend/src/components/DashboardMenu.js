const DashboardMenu = {
  render: (props) => {
    return `
    <div class="dashboard-menu">
      <ul>
        <li class="${props.selected === 'dashboard' ? 'selected' : ''}">
          <a href="/#/dashboard">Biểu Đồ</a>
        </li>
        <li class="${props.selected === 'orders' ? 'selected' : ''}">
          <a href="/#/orderlist">Đặt Hàng</a>
        </li>
        <li class="${props.selected === 'products' ? 'selected' : ''}">
          <a href="/#/productlist">Sản Phẩm</a>
        </li>
      </ul>
    </div>
    `;
  },
};
export default DashboardMenu;
