package com.easyshopping.crawler;

import lombok.extern.slf4j.Slf4j;
//import org.json.simple.parser.JSONParser;
//import org.json.simple.parser.ParseException;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.processor.PageProcessor;

@Slf4j
public class ColesCrawlerTest implements PageProcessor {

    private String domainPrefix = "https://shop.coles.com.au/";

    private int pageIndex = 1;

    private Site site = Site.me().setRetryTimes(3).setSleepTime(500);

    @Override
    public void process(Page page) {
        String productsJsonString = page.getHtml().css("div.products>div:nth-child(10)").regex(">(.+)<\\/div>").toString();

//        JSONParser parser = new JSONParser();
//        try {
//            Product json = (Product) parser.parse(productsJsonString);
//            log.debug(productsJsonString);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//        if (page.isDownloadSuccess()) {
//
//            pageIndex++;
//            page.addTargetRequest(domainPrefix + page.getHtml().links().regex("(/a/national/specials/browse?pageNumber=pageIndex)").toString());
//        }

    }

    @Override
    public Site getSite() {
        return site;
    }

    public static void main(String[] args) {
        Spider postcodeRegionSpider = new Spider(new ColesCrawlerTest());
        postcodeRegionSpider.test("https://shop.coles.com.au/online/COLRSHomePage?storeId=20601&catalogId=10576&langId=-1&tabType=specials&tabId=specials&personaliseSort=false&orderBy=20601_6&errorView=AjaxActionErrorResponse&requesttype=ajax&beginIndex=0");
//        Spider.create(new ColesCrawler()).addUrl("https://shop.coles.com.au/a/national/specials/browse").run();
    }
}
