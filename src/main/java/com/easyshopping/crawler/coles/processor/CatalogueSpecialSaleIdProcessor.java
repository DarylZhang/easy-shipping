package com.easyshopping.crawler.coles.processor;

import com.easyshopping.crawler.coles.ColesUrlConstant;
import com.easyshopping.crawler.coles.model.SaleIdUrlModel;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Download coles postcode region data
 */
@Slf4j
@Component
public class CatalogueSpecialSaleIdProcessor implements PageProcessor {

    @Autowired
    private ColesService colesService;

    @Autowired
    private Gson gson;

    private Site site;

    private List<TColesPostcode> colesPostcodeList;

    private TColesBasic colesBasic;

    private final static String URL_FIND_SALEID = "https://embed.salefinder.com.au/catalogues/view/$retailerId/?order=oldestfirst&myPostcodeId=$myPostcodeId&saleGroup=$saleGroup&includeSaleGroup=$includeSaleGroup&locationId=$locationId";

    public CatalogueSpecialSaleIdProcessor() {
        this.site = Site.me().setRetryTimes(3).setSleepTime(500);
    }

    @Override
    public void process(Page page) {

        if (page.getUrl().toString().equals(ColesUrlConstant.URL_FIND_SALEID_ENTRY_POINT)) {
            try {
                colesBasic = colesService.getColesBasicInfo();
                colesPostcodeList = colesService.findAllByStateCode("VIC");

                List<String> targetURLs = new ArrayList<>();

                if (targetURLs.isEmpty()) {
                    Map<String, Boolean> map = new HashMap<>();

                    for (TColesPostcode tColesPostcode : colesPostcodeList) {
                        if (map.containsKey(tColesPostcode.getLocationId() + tColesPostcode.getIncludeSaleGroup())) {
                            continue;
                        }

                        String nextTargetUrl = URL_FIND_SALEID.replace("$retailerId", colesBasic.getRetailerId())
                                .replace("$myPostcodeId", tColesPostcode.getPostcodeId())
                                .replace("$saleGroup", colesBasic.getSaleGroup())
                                .replace("$includeSaleGroup", tColesPostcode.getIncludeSaleGroup())
                                .replace("$locationId", tColesPostcode.getLocationId());

                        targetURLs.add(nextTargetUrl);
                        map.put(tColesPostcode.getLocationId() + tColesPostcode.getIncludeSaleGroup(), true);
                    }

                    page.addTargetRequests(targetURLs);
                }
            } catch(Exception e){
                e.printStackTrace();
            }
        } else {
            String saleIdPageJson = page.getRawText();
            saleIdPageJson = saleIdPageJson.substring(saleIdPageJson.indexOf("(") + 1, saleIdPageJson.lastIndexOf(")"));
            SaleIdUrlModel saleIdUrlModel = gson.fromJson(saleIdPageJson, SaleIdUrlModel.class);

            String saleIdHtml = saleIdUrlModel.getContent();

            String currentURL = page.getUrl().toString();
            String saleId = saleIdHtml.substring(saleIdHtml.indexOf("view=catalogue2&saleId=") + 23, saleIdHtml.indexOf("&areaName"));
            String locationId = currentURL.substring(currentURL.lastIndexOf("=") + 1, currentURL.length());
            String includeSaleGroup = currentURL.substring(currentURL.indexOf("includeSaleGroup=") + 17, currentURL.indexOf("&locationId"));

            page.putField("saleId", saleId);
            page.putField("includeSaleGroup", includeSaleGroup);
            page.putField("locationId", locationId);
        }
    }

    @Override
    public Site getSite() {
        return site;
    }

}
