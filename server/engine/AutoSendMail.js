const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
var cron = require('node-cron');
// var UserModel = require('../model/UserModel');
// var FavoriteSpotModel = require('../model/FavoriteSpotModel');
var FavoriteApartModel = require('./FavoriteApartModel');
chrome.setDefaultService(new chrome.ServiceBuilder("./ver_96/win32/chromedriver.exe").build());

// var driver = new webdriver.Builder().forBrowser('chrome').build();
cron.schedule('25 * * * *', async function example() {

});
async function findUsers(){

    FavoriteApartModel.find({}, {},  function(err, datas){    
        if(err){
            console.log(err)
        }
        // maxPage = Math.ceil(count/limit);
        console.log(datas)
        // res.send({datas:datas,length:count});
    })

    // var userList = await FavoriteApartModel.find()
    // console.log(userList)
}
console.log('1234')
findUsers();
async function test(){

    await driver.manage().window().maximize();

    //아파트명__법정동명
    await driver.get('http://localhost:3000/apart');
    // var targetElement  = await driver.findElement(By.name('keyword'));


    // await targetElement.sendKeys('벽적골두산');
    // (await driver.findElement(By.id('search'))).click();
    // await driver.executeScript('window.scrollTo(0, 1000);'); 
    await driver.executeScript('console.log("===============")'); 
    await driver.executeScript('console.log("===============")'); 
    await driver.executeScript('console.log("===============")'); 

    
    await driver.wait(until.elementLocated(By.css('#myChart_')));
    await driver.findElement(By.id('myChart_')).click()

}


