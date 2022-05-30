package com.easyshopping.crawler.coles.processor;

import com.easyshopping.crawler.coles.ColesCrawler;
import com.easyshopping.crawler.coles.model.PostcodeStoreModel;
import com.easyshopping.crawler.coles.service.ColesService;
import com.easyshopping.repository.entity.TColesBasic;
import com.easyshopping.repository.entity.TColesPostcode;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

import java.util.ArrayList;
import java.util.List;

/**
 * Download coles postcode region data
 */
@Slf4j
@Component
public class PostcodeStoreProcessor implements PageProcessor {

    @Autowired
    private ColesService colesService;

    @Autowired
    private Gson gson;

    private Site site;

    private List<TColesPostcode> colesPostcodeList;

    private TColesBasic colesBasic;

    private final static String URL_COLES_POSTCODE_STORE = "https://webservice.salefinder.com.au/index.php/api/regions/areasearch/?apikey=$apiKey&area=$regionCode&postcode=$postcode&format=jsonp";

    private int postcodeIndex = 0;

    public PostcodeStoreProcessor() {
        this.site = Site.me().setRetryTimes(3).setSleepTime(500);
    }

    @Override
    public void process(Page page) {

        try {
            if ("Not authorized.".equals(page.getRawText())) {
                colesBasic = colesService.getColesBasicInfo();
                colesPostcodeList = colesService.findAllColesPostcode();

                String url = PostcodeStoreProcessor.URL_COLES_POSTCODE_STORE;
                List<String> targetUrls = new ArrayList<>();
                for (TColesPostcode tColesPostcode : colesPostcodeList) {
                    url = url.replace("$apiKey", colesBasic.getApiKey())
                            .replace("$regionCode", tColesPostcode.getRegionCode())
                            .replace("$postcode", tColesPostcode.getPostcode());

                    targetUrls.add(url);
                    url = PostcodeStoreProcessor.URL_COLES_POSTCODE_STORE;
                }

                page.addTargetRequests(targetUrls);
//                TColesPostcode tColesPostcode = colesPostcodeList.get(postcodeIndex);


//                log.debug("PostcodeStoreProcessor current url is {}", url);
//                postcodeIndex++;
//
//                page.setSkip(true);
//                page.addTargetRequest(url);
//
//                url = ColesCrawler.URL_COLES_POSTCODE_STORE;
            } else {
                String postcodeStoreJson = page.getRawText();
                postcodeStoreJson = postcodeStoreJson.substring(postcodeStoreJson.indexOf("(") + 1, postcodeStoreJson.indexOf(")"));
                PostcodeStoreModel postcodeStore = gson.fromJson(postcodeStoreJson, PostcodeStoreModel.class);

                page.putField(ColesCrawler.COLES_POSTCODE_STORE, postcodeStore);

//                TColesPostcode tColesPostcode = colesPostcodeList.get(postcodeIndex);
//                url = url.replace("$apiKey", colesBasic.getApiKey())
//                        .replace("$regionCode", tColesPostcode.getRegionCode())
//                        .replace("$postcode", tColesPostcode.getPostcode());
//
//                log.debug("PostcodeStoreProcessor current url is {}", url);
//                postcodeIndex++;
//
//                if (postcodeIndex < colesPostcodeList.size())
//                    page.addTargetRequest(url);
//
//                url = ColesCrawler.URL_COLES_POSTCODE_STORE;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Site getSite() {
        return site;
    }

}
