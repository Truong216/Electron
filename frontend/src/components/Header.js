import { getUserInfo } from '../localStorage';

const Header = {
  render: () => {
    const { name, isAdmin } = getUserInfo();
    return ` 
  <div class="brand">
    <a href="/#/">ELECTRO</a>
  </div>
  <div>
  ${
    name
      ? `<a href="/#/profile">${name}</a>`
      : `<a href="/#/signin">Đăng Nhập</a>`
  }    
    <a href="/#/cart">Giỏ Đồ</a>
    ${isAdmin ? `<a href="/#/dashboard">Tùy Chọn</a>` : ''}
  </div>`;
  },
  after_render: () => {},
};
export default Header;
