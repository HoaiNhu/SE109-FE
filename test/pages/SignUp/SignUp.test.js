// const puppeteer = require('puppeteer-core');

// describe('Kiểm thử giao diện trang Sign Up', () => {
//   let browser;
//   let page;

//   beforeAll(async () => {
//     browser = await puppeteer.launch({
//       headless: true,
//       executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
//     });
//     page = await browser.newPage();
//   });

//   afterAll(async () => {
//     await browser.close();
//   });

//   beforeEach(async () => {
//     await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle2' });
//   });

//   // 2.1 Kiểm tra giao diện tổng thể
//   describe('SU_UIF-1: Kiểm tra giao diện tổng thể', () => {
//     it('Hiển thị đúng các thành phần giao diện', async () => {
//       // Kiểm tra tiêu đề
//       const title = await page.$eval('h1.signup__title', (el) => el.textContent);
//       expect(title).toBe('SIGN UP');

//       // Kiểm tra hình ảnh
//       const image = await page.$('img.signup__img');
//       expect(image).toBeTruthy();

//       // Kiểm tra form với 6 trường
//       const inputFields = await page.$$('input');
//       expect(inputFields.length).toBe(6);

//       const placeholders = await page.$$eval('input', (inputs) =>
//         inputs.map((input) => input.placeholder)
//       );
//       expect(placeholders).toEqual(
//         expect.arrayContaining([
//           'Last name',
//           'First Name',
//           'Phone number',
//           'Email',
//           'Password',
//           'Confirm password',
//         ])
//       );

//       // Kiểm tra nút Sign up
//       const signUpButton = await page.$('button[type="submit"]');
//       expect(await signUpButton.evaluate((el) => el.textContent)).toBe('Sign up');

//       // Kiểm tra liên kết Log in
//       const loginLink = await page.$('a.btn__goto__login');
//       expect(await loginLink.evaluate((el) => el.textContent)).toBe('Log in');

//       // Kiểm tra font, chính tả, bố cục
//       const bodyStyle = await page.$eval('body', (el) => window.getComputedStyle(el));
//       expect(bodyStyle.fontFamily).toBeTruthy();
//     });
//   });

//   // 2.2 Kiểm tra textbox Last Name
//   describe('SU_UIF-2 đến SU_UIF-7: Textbox Last Name', () => {
//     it('SU_UIF-2: Textbox Last Name rỗng với placeholder đúng', async () => {
//       const lastNameInput = await page.$('input[name="familyName"]');
//       expect(await lastNameInput.evaluate((el) => el.value)).toBe('');
//       expect(await lastNameInput.evaluate((el) => el.placeholder)).toBe('Last name');
//     });

//     it('SU_UIF-3: Chấp nhận dữ liệu hợp lệ cho Last Name', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-4: Hiển thị lỗi khi nhập Last Name không hợp lệ', async () => {
//       await page.type('input[name="familyName"]', 'Nguyen123');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Last Name can only contain letters and spaces');
//     });

//     it('SU_UIF-5: Hiển thị lỗi khi để trống Last Name', async () => {
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Last Name is required');
//     });

//     it('SU_UIF-6: Hiển thị lỗi khi Last Name chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', '   ');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Last Name is required');
//     });

//     it('SU_UIF-7: Tự động cắt khoảng trắng ở đầu và cuối Last Name', async () => {
//       await page.type('input[name="familyName"]', '  Nguyễn  ');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const lastNameValue = await page.$eval('input[name="familyName"]', (el) => el.value);
//       expect(lastNameValue).toBe('Nguyễn');
//     });
//   });

//   // 2.3 Kiểm tra textbox First Name
//   describe('SU_UIF-8 đến SU_UIF-13: Textbox First Name', () => {
//     it('SU_UIF-8: Textbox First Name rỗng với placeholder đúng', async () => {
//       const firstNameInput = await page.$('input[name="userName"]');
//       expect(await firstNameInput.evaluate((el) => el.value)).toBe('');
//       expect(await firstNameInput.evaluate((el) => el.placeholder)).toBe('First Name');
//     });

//     it('SU_UIF-9: Chấp nhận dữ liệu hợp lệ cho First Name', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-10: Hiển thị lỗi khi nhập First Name không hợp lệ', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Van123');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('First Name can only contain letters and spaces');
//     });

//     it('SU_UIF-11: Hiển thị lỗi khi để trống First Name', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('First Name is required');
//     });

//     it('SU_UIF-12: Hiển thị lỗi khi First Name chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', '   ');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('First Name is required');
//     });

//     it('SU_UIF-13: Tự động cắt khoảng trắng ở đầu và cuối First Name', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', '  Văn  ');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const firstNameValue = await page.$eval('input[name="userName"]', (el) => el.value);
//       expect(firstNameValue).toBe('Văn');
//     });
//   });

//   // 2.4 Kiểm tra textbox Phone
//   describe('SU_UIF-14 đến SU_UIF-19: Textbox Phone', () => {
//     it('SU_UIF-14: Textbox Phone rỗng với placeholder đúng', async () => {
//       const phoneInput = await page.$('input[name="userPhone"]');
//       expect(await phoneInput.evaluate((el) => el.value)).toBe('');
//       expect(await phoneInput.evaluate((el) => el.placeholder)).toBe('Phone number');
//     });

//     it('SU_UIF-15: Chấp nhận dữ liệu hợp lệ cho Phone', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-16: Hiển thị lỗi khi nhập Phone không hợp lệ', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '090123abc');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Phone number must contain only digits');
//     });

//     it('SU_UIF-17: Hiển thị lỗi khi để trống Phone', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Phone number is required');
//     });

//     it('SU_UIF-18: Hiển thị lỗi khi Phone chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '   ');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Phone number is required');
//     });

//     it('SU_UIF-19: Tự động cắt khoảng trắng ở đầu và cuối Phone', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '  0901234567  ');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const phoneValue = await page.$eval('input[name="userPhone"]', (el) => el.value);
//       expect(phoneValue).toBe('0901234567');
//     });
//   });

//   // 2.5 Kiểm tra textbox Email
//   describe('SU_UIF-20 đến SU_UIF-25: Textbox Email', () => {
//     it('SU_UIF-20: Textbox Email rỗng với placeholder đúng', async () => {
//       const emailInput = await page.$('input[name="userEmail"]');
//       expect(await emailInput.evaluate((el) => el.value)).toBe('');
//       expect(await emailInput.evaluate((el) => el.placeholder)).toBe('Email');
//     });

//     it('SU_UIF-21: Chấp nhận dữ liệu hợp lệ cho Email', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'User.Name123@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-22: Hiển thị lỗi khi nhập Email không hợp lệ', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'usér@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Invalid email format');
//     });

//     it('SU_UIF-23: Hiển thị lỗi khi để trống Email', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Email is required');
//     });

//     it('SU_UIF-24: Hiển thị lỗi khi Email chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', '   ');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Email is required');
//     });

//     it('SU_UIF-25: Tự động cắt khoảng trắng ở đầu và cuối Email', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', '  user@domain.com  ');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const emailValue = await page.$eval('input[name="userEmail"]', (el) => el.value);
//       expect(emailValue).toBe('user@domain.com');
//     });
//   });

//   // 2.6 Kiểm tra textbox Password
//   describe('SU_UIF-26 đến SU_UIF-30: Textbox Password', () => {
//     it('SU_UIF-26: Textbox Password rỗng với placeholder đúng', async () => {
//       const passwordInput = await page.$('input[name="userPassword"]');
//       expect(await passwordInput.evaluate((el) => el.value)).toBe('');
//       expect(await passwordInput.evaluate((el) => el.placeholder)).toBe('Password');
//       expect(await passwordInput.evaluate((el) => el.type)).toBe('password');
//     });

//     it('SU_UIF-27: Chấp nhận dữ liệu hợp lệ cho Password', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-28: Hiển thị lỗi khi để trống Password', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Password is required');
//     });

//     it('SU_UIF-29: Hiển thị lỗi khi Password chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', '   ');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Password is required');
//     });

//     it('SU_UIF-30: Tự động cắt khoảng trắng ở đầu và cuối Password', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', '  Pass123!  ');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const passwordValue = await page.$eval('input[name="userPassword"]', (el) => el.value);
//       expect(passwordValue).toBe('Pass123!');
//     });
//   });

//   // 2.7 Kiểm tra textbox ConfirmPassword
//   describe('SU_UIF-31 đến SU_UIF-36: Textbox ConfirmPassword', () => {
//     it('SU_UIF-31: Textbox ConfirmPassword rỗng với placeholder đúng', async () => {
//       const confirmPasswordInput = await page.$('input[name="userConfirmPassword"]');
//       expect(await confirmPasswordInput.evaluate((el) => el.value)).toBe('');
//       expect(await confirmPasswordInput.evaluate((el) => el.placeholder)).toBe('Confirm password');
//       expect(await confirmPasswordInput.evaluate((el) => el.type)).toBe('password');
//     });

//     it('SU_UIF-32: Chấp nhận dữ liệu hợp lệ cho ConfirmPassword', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//     });

//     it('SU_UIF-33: Hiển thị lỗi khi để trống ConfirmPassword', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('ConfirmPassword is required');
//     });

//     it('SU_UIF-34: Hiển thị lỗi khi ConfirmPassword chỉ chứa khoảng trắng', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', '   ');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('ConfirmPassword is required');
//     });

//     it('SU_UIF-35: Tự động cắt khoảng trắng ở đầu và cuối ConfirmPassword', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', '  Pass123!  ');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       const successMessage = await page.$eval('.message.success', (el) => el.textContent);
//       expect(successMessage).toContain('Registration successful!');
//       const confirmPasswordValue = await page.$eval('input[name="userConfirmPassword"]', (el) => el.value);
//       expect(confirmPasswordValue).toBe('Pass123!');
//     });

//     it('SU_UIF-36: Hiển thị lỗi khi ConfirmPassword không khớp Password', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass456!');

//       await page.click('button[type="submit"]');
//       const errorMessage = await page.$eval('.error', (el) => el.textContent);
//       expect(errorMessage).toBe('Passwords do not match');
//     });
//   });

//   // 2.8 Kiểm tra điều hướng và liên kết
//   describe('SU_UIF-37 đến SU_UIF-38: Điều hướng và Liên kết', () => {
//     it('SU_UIF-37: Điều hướng đến trang login sau khi đăng ký thành công', async () => {
//       await page.type('input[name="familyName"]', 'Nguyễn');
//       await page.type('input[name="userName"]', 'Văn');
//       await page.type('input[name="userPhone"]', '0901234567');
//       await page.type('input[name="userEmail"]', 'user@domain.com');
//       await page.type('input[name="userPassword"]', 'Pass123!');
//       await page.type('input[name="userConfirmPassword"]', 'Pass123!');

//       await page.click('button[type="submit"]');
//       await page.waitForSelector('.message.success', { timeout: 5000 });
//       await page.waitForNavigation({ timeout: 5000 });
//       expect(page.url()).toBe('http://localhost:3000/login');
//     });

//     it('SU_UIF-38: Điều hướng đến trang login khi nhấn liên kết', async () => {
//       await page.click('a.btn__goto__login');
//       await page.waitForNavigation({ timeout: 5000 });
//       expect(page.url()).toBe('http://localhost:3000/login');
//     });
//   });
// });