package com.easyshopping.crawler.coles.pipeline;

import com.easyshopping.crawler.coles.ColesCrawler;
import com.easyshopping.crawler.coles.model.PostcodeStoreModel;
import com.easyshopping.crawler.coles.service.ColesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;

/**
 * Save coles postcode region data to DB
*/
@Slf4j
@Service
public class PostcodeStorePipeline implements Pipeline {

    @Autowired
    private ColesService colesService;

    @Override
    public void process(ResultItems resultItems, Task task) {

        if (resultItems.get(ColesCrawler.COLES_POSTCODE_STORE) != null) {
            PostcodeStoreModel postcodeStore = (PostcodeStoreModel) resultItems.get(ColesCrawler.COLES_POSTCODE_STORE);

            colesService.updateCOlesPostcodeStore(postcodeStore);
            log.info("{} has been updated, store id is {}", postcodeStore.getPostcode(), postcodeStore.getLocationId());
        }
    }
}
