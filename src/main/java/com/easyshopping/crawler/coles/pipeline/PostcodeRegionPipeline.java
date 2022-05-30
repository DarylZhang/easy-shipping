package com.easyshopping.crawler.coles.pipeline;

import com.easyshopping.crawler.coles.ColesCrawler;
import com.easyshopping.crawler.coles.model.PostcodeRegionModel;
import com.easyshopping.crawler.coles.service.ColesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;

import java.util.List;

/**
 * Save coles postcode region data to DB
*/
@Slf4j
@Service
public class PostcodeRegionPipeline implements Pipeline {

    @Autowired
    private ColesService colesService;

    @Override
    public void process(ResultItems resultItems, Task task) {

        List<PostcodeRegionModel> postcodeRegionList = (List<PostcodeRegionModel>) resultItems.get(ColesCrawler.COLES_POSTCODE);
        colesService.updateColesPostcode(postcodeRegionList);
    }
}
