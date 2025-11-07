# Pitch_Training

## 音高训练实验系统

这是一个用于音高辨别能力训练和测试的实验系统，包含6个不同的测试模块。

### 测试模块

1. **ABX_falling_low.html** - 低音区下降音调辨别测试
2. **ABX_rising_low.html** - 低音区上升音调辨别测试
3. **ABX_falling_high.html** - 高音区下降音调辨别测试
4. **ABX_rising_high.html** - 高音区上升音调辨别测试
5. **ABX_level_low.html** - 低音区音高辨别测试
6. **ABX_level_high.html** - 高音区音高辨别测试

### 新功能：发送实验结果到邮箱

所有测试模块现在都支持将实验结果通过邮件发送到指定邮箱（jiaxin-lindsy.li@connect.polyu.hk）。

#### EmailJS 配置步骤

要启用邮件发送功能，需要配置EmailJS服务：

1. **注册EmailJS账号**
   - 访问 [EmailJS官网](https://www.emailjs.com/)
   - 注册一个免费账号

2. **创建邮件服务**
   - 登录后，进入 "Email Services" 页面
   - 点击 "Add New Service"
   - 选择邮件服务提供商（如Gmail、Outlook等）
   - 按照提示完成配置
   - 记录下 **Service ID**

3. **创建邮件模板**
   - 进入 "Email Templates" 页面
   - 点击 "Create New Template"
   - 设置模板内容，可以使用以下变量：
     - `{{to_email}}` - 收件人邮箱
     - `{{subject}}` - 邮件主题
     - `{{message}}` - 邮件正文
     - `{{test_type}}` - 测试类型
     - `{{jnd_value}}` 或 `{{threshold_value}}` - 测试结果值
     - `{{accuracy}}` - 准确率
     - `{{test_date}}` - 测试日期
   - 记录下 **Template ID**

4. **获取Public Key**
   - 进入 "Account" 页面
   - 在 "API Keys" 部分找到 **Public Key**

5. **更新HTML文件**
   - 在每个HTML文件的`<head>`部分找到以下代码：
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY"); // 需要替换为实际的EmailJS公钥
   ```
   - 将 `YOUR_PUBLIC_KEY` 替换为你的实际Public Key

   - 在每个HTML文件的`sendResultsToEmail()`函数中找到：
   ```javascript
   emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
   ```
   - 将 `YOUR_SERVICE_ID` 替换为你的Service ID
   - 将 `YOUR_TEMPLATE_ID` 替换为你的Template ID

#### 使用方法

1. 完成实验后，点击"查看结果"按钮
2. 在结果页面，点击蓝色的"Send Results to Email"按钮
3. 系统会自动将实验结果发送到配置的邮箱
4. 发送成功后会显示确认消息

#### 邮件内容

发送的邮件包含以下信息：
- 测试类型
- 阈值结果（JND或音高阈值）
- 标准差
- 准确率统计
- 反应时间统计
- 实验日期和时间
- 试验次数和反转次数

### 其他功能

- **Export Data (CSV)** - 导出详细的实验数据为CSV文件
- **Print Results** - 打印实验结果
- **Diagnostics** - 查看实验诊断信息

### 技术支持

如有问题，请联系：jiaxin-lindsy.li@connect.polyu.hk