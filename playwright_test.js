const { chromium } = require('playwright');
(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to onboarding page...');
  await page.goto('https://school-pro-mocha-beta.vercel.app/onboarding');
  
  console.log('Filling Step 1...');
  await page.fill('input[name="schoolName"]', 'Live Test School');
  await page.fill('input[name="domain"]', 'livetest.edu');
  await page.click('button:has-text("Continue")');
  
  console.log('Filling Step 2...');
  await page.fill('input[name="adminFirstName"]', 'Live');
  await page.fill('input[name="adminLastName"]', 'Admin');
  await page.fill('input[name="adminEmail"]', 'liveadmin@livetest.edu');
  await page.click('button:has-text("Continue")');
  
  console.log('Submitting Step 3...');
  await page.click('button:has-text("Provision System")');
  
  try {
    console.log('Waiting for success message...');
    await page.waitForSelector('text=Provisioning Successful!', { timeout: 15000 });
    console.log('SUCCESS: The test school was successfully provisioned on the live backend!');
  } catch (err) {
    console.log('FAILED to find success message. Error may have occurred.');
  }
  
  await browser.close();
})();
