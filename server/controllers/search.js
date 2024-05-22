const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
let obj = [];
let linkArr = [];
let outputObject = {};

module.exports.search = async (req, res) => {
  for (const e of req.body.links) {
    if (e.toggle) {
      if (e.link === 'noutbuklar.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://noutbuklar.az/?s=${e.sku}&post_type=product&dgwt_wcas=1`);
          await page.waitForSelector('h2.product_title');
          const title = await page.$eval('h2.product_title', element => element.textContent.trim());
          await page.waitForSelector('.elementor-widget-container .price > :last-child bdi');
          const price = await page.$eval('.elementor-widget-container .price > :last-child bdi', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'noutbuklar.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      } 
      else if (e.link === 'deltastore.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://deltastore.az/az/search?q=${e.sku}`);
          await page.waitForSelector('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > h3');
          const title = await page.$eval('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > h3', element => element.textContent.trim());
          await page.waitForSelector('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > p:nth-child(3)');
          const price = await page.$eval('body > section.shops > div > div > div.col-lg-9 > section > div > div > div > div > div > a > div > div.pro-price > p:nth-child(3)', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'deltastore.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'icomp.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://icomp.az/index.php?searchstring=${e.sku}`);
          await page.waitForSelector('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefTitle > a');
          const title = await page.$eval('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefTitle > a', element => element.textContent.trim());
          await page.waitForSelector('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefPriceCart.flex.flexGrid.flexMiddle > div.product_brief_price_block > div');
          const price = await page.$eval('body > div.contentWrap > div > div.contentDynamic.leftContent > main > div.dynamicBlock > div > div > div.productBlockWrap > div.productsBriefBlock > div > div > div > div.productBriefPriceCart.flex.flexGrid.flexMiddle > div.product_brief_price_block > div', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'icomp.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'compstore.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://compstore.az/index.php?searchstring=${e.sku}`);
          await page.waitForSelector('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-name > span > a > h3');
          const title = await page.$eval('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-name > span > a > h3', element => element.textContent.trim());
          await page.waitForSelector('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-price > span > span');
          const price = await page.$eval('#filterResult > div.rounded-box.rounded-border > div > div.cat-short-right > div.cat-short-price > span > span', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'compstore.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'notecomp.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://notecomp.az/index.php?route=product/search&search=${e.sku}`);
          await page.waitForSelector('#content > div.row.row-price > div > div > div.caption > div.product-name > a');
          const title = await page.$eval('#content > div.row.row-price > div > div > div.caption > div.product-name > a', element => element.textContent.trim());
          await page.waitForSelector('#content > div.row.row-price > div > div > div.caption > p > span.price-new > span');
          const price = await page.$eval('#content > div.row.row-price > div > div > div.caption > p > span.price-new > span', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'notecomp.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'aztechshop.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://aztechshop.az/index.php?route=product/search&search=${e.sku}&description=true`);
          await page.waitForSelector('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > a');
          const title = await page.$eval('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > a', element => element.textContent.trim());
          await page.waitForSelector('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > div.product-thumb__price.price > span.price-new');
          const price = await page.$eval('#content > div > div.products-block.row.row-flex > div > div > div.product-thumb__caption > div.product-thumb__price.price > span.price-new', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'aztechshop.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'texnomart.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://texnomart.az/?s=${e.sku}&post_type=product`);
          await page.waitForSelector('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-content > h3');
          const title = await page.$eval('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-content > h3', element => element.textContent.trim());
          await page.waitForSelector('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-price-box > span > span.in-price > span.woocommerce-Price-amount.amount > bdi');
          const price = await page.$eval('#main > div > div.shop-archive.shop-sort-grid > ul > li > div > div.product-details > div.product-price-box > span > span.in-price > span.woocommerce-Price-amount.amount > bdi', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'texnomart.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'amazoncomp.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://amazoncomp.az/?s=${e.sku}`);
          const url = page.url();
          await page.waitForSelector('h3 > a');
          await page.click('h3 > a');
          await page.waitForSelector('h1');
          const title = await page.$eval('h1', element => element.textContent.trim());
          await page.waitForSelector('#product-25274 > div:nth-child(3) > div.buy > p.price > span');
          const price = await page.$eval('#product-25274 > div:nth-child(3) > div.buy > p.price > span', element => element.textContent.trim());

          obj.push({ sku: e.sku, site: 'amazoncomp.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'bakinity.biz') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://www.bakinity.biz/catalog/?q=${e.sku}`);
          await page.waitForSelector('#bx_3966226736_8028 > div.description_wrapp > div.description > div.item-title');
          const title = await page.$eval('#bx_3966226736_8028 > div.description_wrapp > div.description > div.item-title', element => element.textContent.trim());
          await page.waitForSelector('#bx_3966226736_8028 > div.information_wrapp.main_item_wrapper > div > div.cost.prices.clearfix > div.price_matrix_wrapper > div > span > span.price_value');
          const price = await page.$eval('#bx_3966226736_8028 > div.information_wrapp.main_item_wrapper > div > div.cost.prices.clearfix > div.price_matrix_wrapper > div > span > span.price_value', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'bakinity.biz', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'laptops.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://laptops.az/search/?search=${e.sku}`);
          await page.waitForSelector('#content > div:nth-child(10) > div > div > div.caption > h4 > a');
          const title = await page.$eval('#content > div:nth-child(10) > div > div > div.caption > h4 > a', element => element.textContent.trim());
          await page.waitForSelector('#content > div:nth-child(10) > div > div > div.caption > p.price');
          const price = await page.$eval('#content > div:nth-child(10) > div > div > div.caption > p.price', element => element.textContent.trim());
          const url = page.url();

          obj.push({ sku: e.sku, site: 'laptops.az', name: title, price, url });
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      }
      else if (e.link === 'tap.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {
          await page.goto(`https://tap.az/elanlar?order=&q%5Buser_id%5D=&q%5Bcontact_id%5D=&q%5Bprice%5D%5B%5D=&q%5Bprice%5D%5B%5D=&q%5Bregion_id%5D=&q%5Bkeywords%5D=${e.sku}`);

          await page.waitForSelector('#content > div > div > div.categories-products.js-categories-products > div.js-endless-container.products.endless-products > div.products-i.rounded.products-shop > a > div.products-name');
    
          const productElements = await page.$$('#content > div > div > div.categories-products.js-categories-products > div.js-endless-container.products.endless-products .products-i');
          for (const productElement of productElements) {
            const url = await productElement.$eval('.products-link', (element) => element.getAttribute('href'));
            linkArr.push({link: `https://tap.az${url}`, sku: e.sku});
          }

          const browserLinkArr = await puppeteer.launch({ headless: true, protocolTimeout: 20000, args: ['--no-sandbox'] });
          const pageLinkArr = await browserLinkArr.newPage();
          
          for (let e of linkArr) {
            await pageLinkArr.goto(e.link);
  
            await pageLinkArr.waitForSelector('#js-lot-page > div > aside > div > div > div.product-price > div > span.price-val');
            price = await pageLinkArr.$eval('#js-lot-page > div > aside > div > div > div.product-price > div > span.price-val', element => element.textContent.trim());
            await pageLinkArr.waitForTimeout('6000');
            const user = await pageLinkArr.$eval('.product-shop__owner-name, .product-owner__info-name', element => element.textContent.trim());
  
            obj.push({ SKU: e.sku, user, price: price });
          }
        } 
        catch (error) {
          console.error(`Error on ${e.link}: ${error.message}`);
        } 
        finally {
          await browser.close();
        }
      } else if (e.link === 'umico.az') {
        const browser = await puppeteer.launch({ headless: true, protocolTimeout: 3000, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        await page.goto(`https://umico.az/search/${e.sku}?from_search=true&event=view_search_results&query=${e.sku}`);
        await page.waitForSelector('.MPProductsListBannersWrapper .MPProductItem:nth-child(2)');
        title = await page.$eval('.MPProductsListBannersWrapper .MPProductItem:nth-child(2) .MPTitle', (element) => element.textContent);
        if(title.includes(`${e.sku}`)) {
          await page.waitForSelector('.MPProductsListBannersWrapper > div:nth-child(2)');
          price = await page.$eval('.MPCatalogPage.emptyBanner > div > div.MPProductsContainer > div.container.flex > div.MPProducts > div.MPProductsListBanners > div.MPProductsListBannersWrapper > div.MPProductItem > div.MPProduct-Content > a > span:nth-child(2) > span.flex.flex-col.justify-end.text-base.leading-6.font-bold', (element) => element.textContent.trim().replace(' ', '').replace('₼', '').split(' ')[0].toString().trim());
          seller = await page.$eval('.MPCatalogPage.emptyBanner > div > div.MPProductsContainer > div.container.flex > div.MPProducts > div.MPProductsListBanners > div.MPProductsListBannersWrapper > div:nth-child(2) > div.MPProduct-Content > a > span:nth-child(2) > span.MPProductItem-Seller > span:nth-child(2)', (element) => element.textContent.split(',')[0]);
  
          obj.push({SKU: e.sku, seller, price: +price});
        }
      }
    }
  }

  console.log(obj);
  res.send(obj);
  const convertJsonToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(obj);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "List 1");

    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" });

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    XLSX.writeFile(workBook, `list.xlsx`);
  }
  convertJsonToExcel();
  obj.length = 0;
};