const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join("../build")));

const search = require('./routes/search');
app.use('/search', search);

let obj = [];
let links = [];
let linkArr = [];
let outputObject = {};
let percent = 0;
let checked = 0;
let totalSku;
let selectedSites;
let totalSkuWithSites;

const parseLinks = async (link, sku) => {
  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 5000, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const sitesTrue = links.filter((e) => {
    return e.toggle;
  });
  selectedSites = sitesTrue.length;

  totalSkuWithSites = totalSku * selectedSites;

  percent = Math.floor(100 * checked / totalSkuWithSites);

  try {
    let price;
    
    if (link.link === 'noutbuklar.az') {
      await page.goto(`https://noutbuklar.az/?s=${sku.SKU}&post_type=product&dgwt_wcas=1`);
      await page.waitForSelector('.elementor-widget-container .price > :last-child bdi');
      price = await page.$eval('.elementor-widget-container .price > :last-child bdi', element => element.textContent.replace(',', '').replace(/₼/g, '').replace('.00', '').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price.split(' ')[0]});
      console.log({SKU: sku.SKU, site: link.link, price: +price.split(' ')[0]});
    } else if (link.link === 'deltastore.az') {
      await page.goto(`https://deltastore.az/az/search?q=${sku.SKU}`);
      await page.waitForSelector('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > p:nth-child(3)');
      price = await page.$eval('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > p:nth-child(3)', element => element.textContent.replace(/₼/g, '').replace(/\n/g, ' ').trim().split(/\s+/).map(Number));

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: Math.min(...price)});
      console.log({SKU: sku.SKU, site: link.link, price: Math.min(...price)});
    } else if (link.link === 'icomp.az') {
      await page.goto(`https://icomp.az/index.php?searchstring=${sku.SKU}`);
      await page.waitForSelector('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefPriceCart.flex.flexGrid.flexMiddle > div.product_brief_price_block > div');
      price = await page.$eval('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefPriceCart.flex.flexGrid.flexMiddle > div.product_brief_price_block > div', element => element.textContent.replace('₼', '').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price.toString().replace(' ', '')});
      console.log({SKU: sku.SKU, site: link.link, price: +price.toString().replace(' ', '')});
    } else if (link.link === 'compstore.az') {
      await page.goto(`https://compstore.az/index.php?searchstring=${sku.SKU}`);
      await page.waitForSelector('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-price > span > span');
      price = await page.$eval('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-price > span > span', element => element.textContent.replace('azn', '').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price.toString().replace(' ', '')});
      console.log({SKU: sku.SKU, site: link.link, price: +price.toString().replace(' ', '')});
    } else if (link.link === 'notecomp.az') {
      await page.goto(`https://notecomp.az/index.php?route=product/search&search=${sku.SKU}`);
      await page.waitForSelector('#content > div.row.row-price > div > div > div.caption > p > span.price-new > span');
      price = await page.$eval('#content > div.row.row-price > div > div > div.caption > p > span.price-new > span', element => element.textContent.replace(',', '').replace('AZN', ''));

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
      console.log({SKU: sku.SKU, site: link.link, price: +price});
    } else if (link.link === 'aztechshop.az') {
      await page.goto(`https://aztechshop.az/index.php?route=product/search&search=${sku.SKU}&description=true`);
      await page.waitForSelector('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > div.product-thumb__price.price');

      checked++;
    
      try {
        price = await page.$eval('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > div.product-thumb__price.price > span.price-new', el => el.textContent.replace('₼', '').replace(' ', ''));
      } catch (error) {
        price = await page.$eval('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > div.product-thumb__price.price', el => el.textContent.replace('₼', '').replace(' ', '').replace(/\n/g, '').replace(/\t/g, ''));
      }

      checked++;
    
      obj.push({ SKU: sku.SKU, site: link.link, price: +price });
      console.log({ SKU: sku.SKU, site: link.link, price: +price });
    } else if (link.link === 'texnomart.az') {
      await page.goto(`https://texnomart.az/?s=${sku.SKU}&post_type=product`);
      await page.waitForSelector('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-price-box > span > span.in-price > span.woocommerce-Price-amount.amount > bdi');
      price = await page.$eval('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-price-box > span > span.in-price > span.woocommerce-Price-amount.amount > bdi', element => element.textContent.replace(',', '').replace('₼', '').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
      console.log({ SKU: sku.SKU, site: link.link, price: +price });
    } else if (link.link === 'amazoncomp.az') {
      await page.goto(`https://amazoncomp.az/?s=${sku.SKU}&v=546a9a80eb98`);
      await page.waitForSelector('h3');
      await page.click('h3');
      await page.waitForSelector('div.buy > p.price');
      price = await page.$eval('div.buy > p.price', element => element.textContent.replace(/AZN/g, '').split(' ').map(price => parseInt(price.replace(/\s/g, ''), 10)));

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: Math.min(...price)});
      console.log({SKU: sku.SKU, site: link.link, price: Math.min(...price)});
    } else if (link.link === 'bakinity.biz') {
      await page.goto(`https://www.bakinity.biz/catalog/?q=${sku.SKU}`);
      await page.waitForSelector('.information_wrapp.main_item_wrapper > div > div.cost.prices.clearfix > div.price_matrix_wrapper > div > span > span.price_value');
      price = await page.$eval('.information_wrapp.main_item_wrapper > div > div.cost.prices.clearfix > div.price_matrix_wrapper > div > span > span.price_value', element => element.textContent.replace('AZN', '').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
      console.log({SKU: sku.SKU, site: link.link, price: +price});
    } else if (link.link === 'bermud.az') {
      await page.goto(`https://bermud.az/search?controller=search&s=${sku.SKU}`);
      await page.waitForSelector('#js-product-list > div > article > div > div.product-description > div.wrapper-buy > div > span');
      price = await page.$eval('#js-product-list > div > article > div > div.product-description > div.wrapper-buy > div > span', element => element.textContent.replace('AZN', '').trim().replace(' ', ''));

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
    } else if (link.link === 'bakuelectronics.az') {
      await page.goto(`https://www.bakuelectronics.az/search.html?query=${sku.SKU}`);
      await page.waitForSelector('#mse2_results > div > div > div.product__value > div.product__price.price_discount_list > div.product__price--cur');
      price = await page.$eval('#mse2_results > div > div > div.product__value > div.product__price.price_discount_list > div.product__price--cur', element => element.textContent.replace(',', '.').replace('₼', '').trim().replace(' ', ''));

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
      console.log({SKU: sku.SKU, site: link.link, price: +price});
    } else if (link.link === 'kontakt.az') {
      await page.goto(`https://kontakt.az/az/catalogsearch/result/?q=${sku.SKU}`);
      await page.waitForSelector('#maincontent > div.productCont > div.productCont__osnova.product-is-exist > div > div > div.prodItemas > div.prodItemas__right > div > div.prodCart__top2 > div.prodCart__prices.product-desktop-block > strong');
      price = await page.$eval('#maincontent > div.productCont > div.productCont__osnova.product-is-exist > div > div > div.prodItemas > div.prodItemas__right > div > div.prodCart__top2 > div.prodCart__prices.product-desktop-block > strong', element => element.textContent.replace('.', '').replace('₼', '').replace(',', '.').trim());

      checked++;

      obj.push({SKU: sku.SKU, site: link.link, price: +price});
      console.log({SKU: sku.SKU, site: link.link, price: +price});
    } else if (link.link === 'tap.az') {
      await page.goto(`https://tap.az/elanlar?order=&q%5Buser_id%5D=&q%5Bcontact_id%5D=&q%5Bprice%5D%5B%5D=&q%5Bprice%5D%5B%5D=&q%5Bregion_id%5D=&q%5Bkeywords%5D=${sku.SKU}`);
      await page.waitForSelector('#content > div > div > div.categories-products.js-categories-products > div.js-endless-container.products.endless-products > div.products-i.rounded.products-shop > a > div.products-name');
    
      const productElements = await page.$$('#content > div > div > div.categories-products.js-categories-products > div.js-endless-container.products.endless-products .products-i');
      for (const productElement of productElements) {
        const url = await productElement.$eval('.products-link', (element) => element.getAttribute('href'));
        linkArr.push({link: `https://tap.az${url}`, sku: sku.SKU});
      }
    } else if (link.link === 'umico.az') {
      await page.goto(`https://umico.az/search/${sku.SKU}?from_search=true&event=view_search_results&query=${sku.SKU}`);
      await page.waitForSelector('.MPProductsListBannersWrapper .MPProductItem:nth-child(2)');
      title = await page.$eval('.MPProductsListBannersWrapper .MPProductItem:nth-child(2) .MPTitle', (element) => element.textContent);
      if(title.includes(`${sku.SKU}`)) {
        await page.waitForSelector('.MPProductsListBannersWrapper > div:nth-child(2)');
        price = await page.$eval('.MPCatalogPage.emptyBanner > div > div.MPProductsContainer > div.container.flex > div.MPProducts > div.MPProductsListBanners > div.MPProductsListBannersWrapper > div.MPProductItem > div.MPProduct-Content > a > span:nth-child(2) > span.flex.flex-col.justify-end.text-base.leading-6.font-bold', (element) => element.textContent.trim().replace(' ', '').replace('₼', '').split(' ')[0].toString().trim());
        seller = await page.$eval('.MPProductItem-Seller span:last-child', (element) => element.textContent.split(',')[0].trim());

        checked++;

        obj.push({SKU: sku.SKU, seller, price: +price});
        console.log({SKU: sku.SKU, seller, price: +price});
      }
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    checked++;
  } finally {
    await browser.close();
  }
};

app.post('/uploadLinks', async (req, res) => {
  links = req.body.links;

  app.post('/upload', upload.single('myfile'), async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    totalSku = data.length;

    for (const link of links) {
      if (link.toggle) {
        for (const sku of data) {
          app.get('/status-info', (req, res) => {
            res.send({totalSku, selectedSites, totalSkuWithSites, checked, percent, obj});
          });
          
          await parseLinks(link, sku);
        }
      }
    }

    const parserLinkArr = async () => {
      const browserLinkArr = await puppeteer.launch({ headless: true, protocolTimeout: 5000, args: ['--no-sandbox'] });
      const pageLinkArr = await browserLinkArr.newPage();

      try {
        for (let e of linkArr) {
          await pageLinkArr.goto(e.link);

          await pageLinkArr.waitForSelector('#js-lot-page > div > aside > div > div > div.product-price > div > span.price-val');
          price = await pageLinkArr.$eval('#js-lot-page > div > aside > div > div > div.product-price > div > span.price-val', element => element.textContent.trim());
          await pageLinkArr.waitForTimeout('6000');
          const user = await pageLinkArr.$eval('.product-shop__owner-name, .product-owner__info-name', element => element.textContent.trim());

          checked++;

          obj.push({ SKU: e.sku, user, price: price });
          console.log({ SKU: e.sku, user, price: price });
        }

        if (links.some(link => link.link === 'tap.az' && link.toggle === false) && links.some(link => link.link === 'umico.az' && link.toggle === false)) {
          obj.forEach(({ SKU, site, price }) => {
            if (!outputObject[SKU]) {
              outputObject[SKU] = {};
            }
          
            outputObject[SKU][site] = price;
          });
          
          const resultArray = Object.entries(outputObject).map(([SKU, pricesBySite]) => ({
            SKU,
            ...pricesBySite,
          }));
          
          console.log(resultArray);
          res.send(resultArray);
          const workSheet = xlsx.utils.json_to_sheet(resultArray);
          const workBook = xlsx.utils.book_new();
  
          xlsx.utils.book_append_sheet(workBook, workSheet, "List 1");
  
          xlsx.write(workBook, { bookType: 'xlsx', type: "buffer" });
          xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
          xlsx.writeFile(workBook, `list.xlsx`);
        } else {
          console.log(obj);
          res.send(obj);
          const workSheet = xlsx.utils.json_to_sheet(obj);
          const workBook = xlsx.utils.book_new();
  
          xlsx.utils.book_append_sheet(workBook, workSheet, "List 1");
  
          xlsx.write(workBook, { bookType: 'xlsx', type: "buffer" });
          xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
          xlsx.writeFile(workBook, `list.xlsx`);
        }
      } catch (error) {
        console.error(`Error during navigation in parserLinkArr: ${error.message}`);
      } finally {
        await pageLinkArr.close();
        await browserLinkArr.close();
      }
    };

    await parserLinkArr();
    obj.length = 0;
    links.length = 0;
    linkArr.length = 0;
    outputObject = {};
    checked = 0;
    percent = 0;
  });
});

/* app.get('/download', (req, res) => {
  const filePath = path.join('./list.xlsx');
  res.download(filePath, 'list.xlsx');
}); */

app.listen(8888, (err) => {
  if (err) return err;
  console.log(`Server on 8888 is running...`);
});