const welcomeEmail = (name) => ({
  subject: "Welcome to Onggoshree 🌿",
  html: `
    <div style="font-family: 'Noto Sans Bengali', 'SolaimanLipi', sans-serif; max-width: 480px; margin: auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAEFEB;">
    <div style="background: linear-gradient(135deg, #16352A 0%, #1F4A3A 100%); padding: 36px 32px 28px;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600; letter-spacing: 0.2px;">স্বাগতম, ${name}!</h1>
        <p style="margin: 8px 0 0; color: #B8C7BE; font-size: 14px;">অঙ্গশ্রীতে আপনার যাত্রা শুরু হলো</p>
    </div>

    <div style="padding: 32px;">
        <p style="margin: 0 0 20px; color: #17251E; font-size: 15px; line-height: 1.8;">
        অঙ্গশ্রী পরিবারে যুক্ত হওয়ার জন্য আপনাকে ধন্যবাদ। আপনার অ্যাকাউন্ট এখন সম্পূর্ণ প্রস্তুত। আমাদের স্কিনকেয়ার পণ্যসম্ভার ঘুরে দেখুন, আপনার ত্বকের উপযোগী রুটিন পেতে <strong>Skin AI</strong> ব্যবহার করুন এবং প্রতিটি অর্ডারে অর্জন করুন <strong>Glow</strong> পয়েন্ট।
        </p>

        <div style="height: 1px; background: #EAEFEB; margin: 32px 0 24px;"></div>

        <p style="margin: 0; color: #17251E; font-size: 14px; font-weight: 600;">Bokhtear Md. Abid</p>
        <p style="margin: 2px 0 0; color: #6E7D72; font-size: 13px;">CEO, অঙ্গশ্রী</p>
    </div>
    </div>
  `,
});

const orderConfirmationEmail = (order) => ({
  subject: `অর্ডার নিশ্চিত হয়েছে — #${order._id.toString().slice(-8).toUpperCase()}`,
  html: `
    <div style="font-family: 'Noto Sans Bengali', 'SolaimanLipi', sans-serif; max-width: 480px; margin: auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAEFEB;">
      <div style="background: linear-gradient(135deg, #16352A 0%, #1F4A3A 100%); padding: 36px 32px 28px;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600; letter-spacing: 0.2px;">ধন্যবাদ, ${order.customerName}!</h1>
        <p style="margin: 8px 0 0; color: #B8C7BE; font-size: 14px;">আপনার অর্ডার সফলভাবে গৃহীত হয়েছে</p>
      </div>

      <div style="padding: 32px;">
        <p style="margin: 0 0 8px; color: #17251E; font-size: 15px; line-height: 1.8;">
          আপনার অর্ডারটি নিশ্চিত করা হয়েছে এবং প্রস্তুত করা হচ্ছে। পণ্য পাঠানো হলে আপনাকে জানানো হবে।
        </p>

        <p style="margin: 24px 0 8px; color: #6E7D72; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">অর্ডার #${order._id.toString().slice(-8).toUpperCase()}</p>

        <table style="width: 100%; border-collapse: collapse; margin: 0 0 8px;">
          ${order.items
            .map(
              (item) => `
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #F2F5F3; color: #17251E; font-size: 14px;">${item.qty}× ${item.name}</td>
            <td style="padding: 14px 0; border-bottom: 1px solid #F2F5F3; color: #17251E; font-size: 14px; text-align: right;">৳${(item.price * item.qty).toFixed(0)}</td>
          </tr>`
            )
            .join("")}
          <tr>
            <td style="padding: 16px 0 0; color: #16352A; font-size: 15px; font-weight: 700;">সর্বমোট</td>
            <td style="padding: 16px 0 0; color: #16352A; font-size: 16px; font-weight: 700; text-align: right;">৳${order.total.toFixed(0)}</td>
          </tr>
        </table>

        <div style="background: #F4F8F5; border-radius: 10px; padding: 16px; margin: 24px 0 0;">
          <p style="margin: 0; color: #16352A; font-size: 13px; line-height: 1.7;">
            📍 ডেলিভারি ঠিকানা<br>
            <span style="color: #6E7D72;">${order.address}</span>
          </p>
        </div>

        <div style="height: 1px; background: #EAEFEB; margin: 32px 0 24px;"></div>

        <p style="margin: 0; color: #6E7D72; font-size: 13px;">— অঙ্গশ্রী টিম</p>
      </div>
    </div>
  `,
});

const adminNewOrderEmail = (order) => ({
  subject: `নতুন অর্ডার — #${order._id.toString().slice(-8).toUpperCase()}`,
  html: `
    <div style="font-family: 'Noto Sans Bengali', 'SolaimanLipi', sans-serif; max-width: 480px; margin: auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EAEFEB;">
      <div style="background: linear-gradient(135deg, #16352A 0%, #1F4A3A 100%); padding: 36px 32px 28px;">
        <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600; letter-spacing: 0.2px;">নতুন অর্ডার এসেছে</h1>
        <p style="margin: 8px 0 0; color: #B8C7BE; font-size: 14px;">অর্ডার #${order._id.toString().slice(-8).toUpperCase()}</p>
      </div>

      <div style="padding: 32px;">
        <div style="background: #F4F8F5; border-radius: 10px; padding: 18px; margin: 0 0 24px;">
          <p style="margin: 0 0 6px; color: #17251E; font-size: 16px; font-weight: 700;">${order.customerName}</p>
          <p style="margin: 0 0 4px; font-size: 14px;">
            <a href="tel:${order.phone}" style="color: #16352A; text-decoration: none; font-weight: 600;">📞 ${order.phone}</a>
          </p>
          <p style="margin: 0; color: #6E7D72; font-size: 13px; line-height: 1.6;">📍 ${order.address}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 0 0 8px;">
          ${order.items
            .map(
              (item) => `
          <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid #F2F5F3; color: #17251E; font-size: 14px;">${item.qty}× ${item.name}</td>
            <td style="padding: 14px 0; border-bottom: 1px solid #F2F5F3; color: #17251E; font-size: 14px; text-align: right;">৳${(item.price * item.qty).toFixed(0)}</td>
          </tr>`
            )
            .join("")}
          <tr>
            <td style="padding: 16px 0 0; color: #16352A; font-size: 15px; font-weight: 700;">সর্বমোট</td>
            <td style="padding: 16px 0 0; color: #16352A; font-size: 16px; font-weight: 700; text-align: right;">৳${order.total.toFixed(0)}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
});

module.exports = { welcomeEmail, orderConfirmationEmail, adminNewOrderEmail };