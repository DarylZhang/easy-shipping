package com.easyshopping.crawler.coles;

import com.easyshopping.crawler.coles.pipeline.CatalogueSpecialNavbarPipeline;
import com.easyshopping.crawler.coles.pipeline.CatalogueSpecialSaleIdPipeline;
import com.easyshopping.crawler.coles.pipeline.PostcodeRegionPipeline;
import com.easyshopping.crawler.coles.pipeline.PostcodeStorePipeline;
import com.easyshopping.crawler.coles.processor.CatalogueSpecialNavbarProcessor;
import com.easyshopping.crawler.coles.processor.CatalogueSpecialSaleIdProcessor;
import com.easyshopping.crawler.coles.processor.PostcodeRegionProcessor;
import com.easyshopping.crawler.coles.processor.PostcodeStoreProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.Spider;

@Slf4j
@Component
public class ColesCrawler {

    @Autowired
    private PostcodeRegionProcessor postcodeRegionProcessor;

    @Autowired
    private PostcodeStoreProcessor postcodeStoreProcessor;

    @Autowired
    private CatalogueSpecialSaleIdProcessor cataLogueSpecialProcessor;

    @Autowired
    private CatalogueSpecialNavbarProcessor catalogueSpecialNavbarProcessor;

    @Autowired
    private PostcodeRegionPipeline postcodeRegionPipeline;

    @Autowired
    private PostcodeStorePipeline postcodeStorePipeline;

    @Autowired
    private CatalogueSpecialSaleIdPipeline catalogueSpecialPipeline;

    @Autowired
    private CatalogueSpecialNavbarPipeline catalogueSpecialNavbarPipeline;

    public final static String COLES_POSTCODE = "coles_postcode";
    public final static String COLES_POSTCODE_STORE = "coles_postcode_store";

    public ColesCrawler() {

    }

    public void run() {

        //Step 1, Get Postcode region map;
//        this.crawlPostcode();

//        log.info("================= Coles postcode crawl completed ==================");

        //Step 2, Get Postcode store id;
//        this.crawlPostcodeStore();

//        log.info("============= Coles postcode store id crawl completed =============");

        //Step 3, Get catalogue special;
        this.crawlCatalogueSpecial();

        log.info("============= Get catalogue special crawl completed =============");
    }

    private void crawlPostcode() {
        String URL_COLES_POSTCODE_REGION = "https://www.coles.com.au/content/dam/coles/postcode-to-region-mapping/postcodeRegionMap.json";

        Spider.create(postcodeRegionProcessor)
                .addUrl(URL_COLES_POSTCODE_REGION)
                .addPipeline(postcodeRegionPipeline)
                .run();
    }

    private void crawlPostcodeStore() {
        String URL_COLES_POSTCODE_STORE = "https://webservice.salefinder.com.au/index.php/api/regions/areasearch/?apikey=$apiKey&area=$regionCode&postcode=$postcode&format=jsonp";

        Spider.create(postcodeStoreProcessor)
                .addUrl(URL_COLES_POSTCODE_STORE)
                .addPipeline(postcodeStorePipeline)
//                .thread(5)
                .run();
    }

    private void crawlCatalogueSpecial() {
        //Step 1, get saleId for different postcode
        Spider.create(cataLogueSpecialProcessor)
                .addUrl(ColesUrlConstant.URL_FIND_SALEID_ENTRY_POINT)
                .addPipeline(catalogueSpecialPipeline)
                .run();

        //Step 2, get catalogue for different postcode
        Spider.create(catalogueSpecialNavbarProcessor)
                .addUrl(ColesUrlConstant.URL_FIND_CATALOGUE_NAVBAR_ENTRY_POINT)
                .addPipeline(catalogueSpecialNavbarPipeline)
//                .thread(5)
                .run();

        //Get catalogue
    }



}
