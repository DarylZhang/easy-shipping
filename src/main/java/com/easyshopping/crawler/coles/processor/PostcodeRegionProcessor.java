package com.easyshopping.crawler.coles.processor;

import com.easyshopping.crawler.coles.ColesCrawler;
import com.easyshopping.crawler.coles.model.PostcodeRegionModel;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;
import us.codecraft.webmagic.selector.Json;

import java.util.List;

/**
 * Download coles postcode region data
 */
@Slf4j
@Component
public class PostcodeRegionProcessor implements PageProcessor {

    @Autowired
    private Gson gson;

    private Site site;

    public PostcodeRegionProcessor() {
        this.site = Site.me().setRetryTimes(3).setSleepTime(500);
    }

    @Override
    public void process(Page page) {
        Json postcodeRegionJson = page.getJson();

        try {
            JsonObject jsonObject = JsonParser.parseString(postcodeRegionJson.toString()).getAsJsonObject();

            List<PostcodeRegionModel> postRegionList = gson.fromJson(jsonObject.getAsJsonObject("Mappings").getAsJsonArray("PostcodeRegionMapping"), new TypeToken<List<PostcodeRegionModel>>(){}.getType());

            page.putField(ColesCrawler.COLES_POSTCODE, postRegionList);
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Site getSite() {
        return site;
    }

}
