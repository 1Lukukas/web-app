require('dotenv').config()
const { test, expect } = require('@playwright/test');
// eslint-disable-next-line no-unused-vars
const { default: mongoose} = require('mongoose');
const User = require('../../models/user');

test.describe('Test suite', () =>{

  test.beforeAll(async () =>{
    mongoose.connect(process.env.TEST_DATABASE_URL, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
  })

  test.afterAll(async() => {
    await User.deleteMany({})
    mongoose.disconnect()
  })

  test.describe('Registration', () => { 
      test.beforeEach(async ({ page }) => {
        await page.goto('https://localhost:3000/');
        await page.locator('text=REGISTER').click();
      })

      test.beforeAll(async () =>{
        await new User({
          email: "email123",
          username: "username123",
          password: "password123",
        }).save()
      })
      test.afterAll(async() => {
        await User.deleteMany({})
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

      test('username already exists', async ({ page }) =>{
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill('emailo');
        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').fill('username123');
        await page.locator('input[name="password"]').click();
        await page.locator('input[name="password"]').fill('password');
        await page.locator('input[name="repassword"]').click();
        await page.locator('input[name="repassword"]').fill('password');
        await page.pause()
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
      
      test('email already exists', async ({ page }) =>{
        await page.locator('input[name="email"]').click();
        await page.locator('input[name="email"]').fill('email123');
        await page.locator('input[name="username"]').click();
        await page.locator('input[name="username"]').fill('usernameo');
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

  test.describe('Login', () => {

    test.beforeAll(async () =>{
      await new User({
        email: "email",
        username: "username",
        password: "test"
      }).save()

    })
    test.afterAll(async() => {
      await User.deleteMany({})
    })

    test('check that empty field validation works', async ({ page }) => {
      await page.goto('https://localhost:3000/');
  
      await page.locator('id=login').click();
      let dialogPromise;
      let text;
      await Promise.all([
        dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          dialog.accept()
          return dialog.message();
        }),
        page.locator('button:has-text("LOGIN")').click(),
        text = await dialogPromise
      ])
  
      expect(text).toBe('All fields must be filled out')
    })
  
    test('check that non existing user validation works', async ({ page }) => {
      await page.goto('https://localhost:3000/');
      await page.locator('id=login').click();
  
      await page.locator('input#login').fill('password');
      await page.locator('input#password').fill('password');
  
      let dialogPromise;
      let text;
      await Promise.all([
        dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          dialog.accept()
          return dialog.message();
        }),
        page.locator('button:has-text("LOGIN")').click(),
        text = await dialogPromise
      ])
      expect(text).toBe('Username or password wrong')
    })
  
    test('check that wrong password validation works', async ({ page }) => {
      await page.goto('https://localhost:3000/');
      await page.locator('id=login').click();
  
      await page.locator('input#login').fill('username');
      await page.locator('input#password').fill('username');
  
      let dialogPromise;
      let text;
      await Promise.all([
        dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          dialog.accept()
          return dialog.message();
        }),
        page.locator('button:has-text("LOGIN")').click(),
        text = await dialogPromise
      ])
      expect(text).toBe('Username or password wrong')
    })
  
    test('check that login using username works', async ({ page }) => {
      await page.goto('https://localhost:3000/');
      await page.locator('id=login').click();
  
      await page.locator('input#login').fill('username');
      await page.locator('input#password').fill('password');
  
      let dialogPromise;
      let text;
      await Promise.all([
        dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          dialog.accept()
          return dialog.message();
        }),
        page.locator('button:has-text("LOGIN")').click(),
        text = await dialogPromise
      ])
      expect(text).toBe('Username or password wrong')
    })
  
    test('check that login using email works', async ({ page }) => {
      await page.goto('https://localhost:3000/');
      await page.locator('id=login').click();
  
      await page.waitForSelector('#emailOption')
      await page.locator('#emailOption').check();
      await page.locator('input#login').fill('email');
      await page.locator('input#password').fill('password');
  
      let dialogPromise;
      let text;
      await Promise.all([
        dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
          dialog.accept()
          return dialog.message();
        }),
        page.locator('button:has-text("LOGIN")').click(),
        text = await dialogPromise
      ])
      expect(text).toBe('Email or password wrong')
    })
  });

})