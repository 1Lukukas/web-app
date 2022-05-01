require('dotenv').config()
const { test, expect } = require('@playwright/test');
// eslint-disable-next-line no-unused-vars
const { default: mongoose} = require('mongoose');
const User = require('../../models/user');

test.describe('Registration', () => { 
    test.beforeEach(async ({ page }) => {
      await page.goto('https://localhost:3000/');
      await page.locator('text=REGISTER').click();
    })


    test.beforeAll(async () =>{
      mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true })
      const db = mongoose.connection
      db.on('error', (error) => console.error(error))
      db.once('open', () => console.log('Connected to Database'))
      await new User({
        email: "a",
        username: "d",
        password: "c",
      }).save()
    })
    test.afterAll(async() => {
      await User.deleteMany({})
      mongoose.disconnect()
    })

    test('empty fields', async ({ page }) => {
      
      let dialogPromise;
      let text;
      await Promise.all([
      dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
        dialog.accept()
        return dialog.message();
      }),
      page.locator('button:has-text("Register")').click(),
      text = await dialogPromise
    ])
      expect(text).toBe("All fields must be filled out")
    });

    test('correct fields', async ({ page }) =>{
      await page.locator('input[name="email"]').click();
      await page.locator('input[name="email"]').fill('test');
      await page.locator('input[name="username"]').click();
      await page.locator('input[name="username"]').fill('test');
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('test');
      await page.locator('input[name="repassword"]').click();
      await page.locator('input[name="repassword"]').fill('test');

      let dialogPromise;
      let text;
      await Promise.all([
      dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
        dialog.accept()
        return dialog.message();
      }),
      page.locator('button:has-text("Register")').click(),
      text = await dialogPromise
    ])
      expect(text).toBe("Registration successful!")
    })

    test('password mismatch', async ({ page }) =>{
      await page.locator('input[name="email"]').click();
      await page.locator('input[name="email"]').fill('test');
      await page.locator('input[name="username"]').click();
      await page.locator('input[name="username"]').fill('test');
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('test');
      await page.locator('input[name="repassword"]').click();
      await page.locator('input[name="repassword"]').fill('te');

      let dialogPromise;
      let text;
      await Promise.all([
      dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
        dialog.accept()
        return dialog.message();
      }),
      page.locator('button:has-text("Register")').click(),
      text = await dialogPromise
      ])
      expect(text).toBe("Passwords do not match")
    })

    test('user already exists', async ({ page }) =>{
      await page.locator('input[name="email"]').click();
      await page.locator('input[name="email"]').fill('a');
      await page.locator('input[name="username"]').click();
      await page.locator('input[name="username"]').fill('d');
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('password');
      await page.locator('input[name="repassword"]').click();
      await page.locator('input[name="repassword"]').fill('password');

      let dialogPromise;
      let text;
      await Promise.all([
      dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
        dialog.accept()
        return dialog.message();
      }),
      page.locator('button:has-text("Register")').click(),
      text = await dialogPromise
    ])
      expect(text).toBe("Username or email already exists")
    })
})

