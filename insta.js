let fs = require("fs");
let puppeteer = require('puppeteer');

let credentialsFile=process.argv[2];

async function fn(){
    let contentFile=await fs.promises.readFile(credentialsFile);
    let object=JSON.parse(contentFile);
    let browser=await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        slowMo:10,
        args:['--start-maximized', '--incognito','--disable-notifications']
    });

    let url=object.url;
    let username=object.username;
    let pswd=object.pswd;
    let accountSearched=object.accountSearched;
    let numberOfPosts=object.numberOfPosts;

    let pages=await browser.pages();
    let page=pages[0];
    
    await page.goto(url);

    await page.waitForSelector('input[type=text]');
    // console.log("works fine");

    await page.type('input[type=text]',username);
    await page.type('input[type=password]',pswd);
    await navigationFn('button[type=submit]',page);

    // console.log("home page");
    await page.waitFor(2000);

    await page.waitForSelector('input[type=text]',{visible:true});
    await page.type('input[type=text]',accountSearched);

    await page.waitForSelector(".yCE8d");
    await page.click(".yCE8d");

    // console.log("page reached");


    await page.waitForSelector("._2z6nI");
    await page.waitFor(3000);
    let pictureElements = await page.$$(".v1Nh3.kIKUG._bz0w");
    await pictureElements[0].click();
    await page.waitFor(2000);

    // console.log(pictureElements.length);

    let index=1;

    while(index<=numberOfPosts){
        await page.waitForSelector('.fr66n .wpO6b ');
        let likebutton = await page.$('.fr66n .wpO6b ');
        await likebutton.click({delay:100});
        await page.waitFor(1000);
        let nextPage=await page.$('._65Bje.coreSpriteRightPaginationArrow');
        await nextPage.click({delay:100});
        index++;
        await page.waitFor(1500);
        // console.log("page liked");

    }

    console.log("end")
    await browser.close();
        
}

fn();

async function navigationFn(selector,tab){
    await Promise.all([tab.click(selector), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
}
