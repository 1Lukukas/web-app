require('dotenv').config()
const { test, expect } = require('@playwright/test');
const { default: mongoose } = require('mongoose');

const User = require('../../models/user');

test.describe('basic test', () => {

  test.beforeAll(async() => {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))

    await new User({
      email: "email",
      username: "username",
      password: "test",
    }).save()
  })

  test.afterAll(async() => {
    await User.deleteMany({})
    mongoose.disconnect()
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