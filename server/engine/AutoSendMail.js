const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
var cron = require('node-cron');

chrome.setDefaultService(new chrome.ServiceBuilder("./ver_96/win32/chromedriver.exe").build());

var driver = new webdriver.Builder().forBrowser('chrome').build();
// cron.schedule('25 * * * *', async function example() {

test();
async function test(){

    await driver.manage().window().maximize();

    await driver.get('http://localhost:3000/apart');
    var targetElement  = await driver.findElement(By.name('keyword'));


    await targetElement.sendKeys('벽적골두산');
    (await driver.findElement(By.id('search'))).click();
    await driver.executeScript('window.scrollTo(0, 1000);'); 

    await driver.executeScript('console.log($("#myChart_0"))'); 
    await driver.executeScript('$("#myChart_0")[0].click()'); 

}

//var element = ( (await driver.wait(until.elementLocated(By.xpath('*[@id="tbody"]/tr[2]/td/div[1]/a')), 10000)).click());
// (await driver.findElement(By.id('test0'))).click();
    
// await driver.findElement(By.xpath('//*[@id="myChart_0"]')).click();
//스크롤을 맨 밑으로 내림
// await driver.executeScript("arguments[0].scrollIntoView();", $("#mkChart_0"));
// await driver.wait(until.elementLocated(By.id('mkChart_0')), 3000).then(driver.findElement(By.id('mkChart_0')).click());
// await driver.executeScript('$("#mkChart_0")[0].click()');




// });

// driver.wait(check_title, 1000);


// function check_title() {
//     return driver.getTitle().then(function (title) {
//     if (title === 'wiki - Google Search') {
//         console.log('success');
//         return true;
//     } else {
//         console.log('fail -- ' + title);
//     }
//     });
// }

