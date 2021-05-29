const CheckoutSteps = {
  render: (props) => {
    return `
    <div class="checkout-steps">
      <div class="${props.step1 ? 'active' : ''}">Đăng Nhập</div>
      <div class="${props.step2 ? 'active' : ''}">Giao Hàng</div>
      <div class="${props.step3 ? 'active' : ''}">Thanh Toán</div>
      <div class="${props.step4 ? 'active' : ''}">Đặt Hàng</div>
    </div>
    `;
  },
};
export default CheckoutSteps;
