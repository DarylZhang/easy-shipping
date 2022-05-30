package com.easyshopping.crawler.coles.pipeline;

import com.easyshopping.crawler.coles.service.ColesService;
import com.easyshopping.repository.entity.TColesPostcode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.ResultItems;
import us.codecraft.webmagic.Task;
import us.codecraft.webmagic.pipeline.Pipeline;

import java.util.ArrayList;
import java.util.List;

/**
 * Download coles postcode region data
 */
@Slf4j
@Component
public class CatalogueSpecialSaleIdPipeline implements Pipeline {

    @Autowired
    private ColesService colesService;

    private List<TColesPostcode> colesPostcodeList = new ArrayList<>();

    @Override
    public void process(ResultItems resultItems, Task task) {

        if (colesPostcodeList.isEmpty()) {
            colesPostcodeList = colesService.findAllByStateCode("VIC");
        }

        String saleId = (String) resultItems.get("saleId");
        String locationId = (String) resultItems.get("locationId");
        String includeSaleGroup = (String) resultItems.get("includeSaleGroup");

        colesService.updateCurrentSaleId(saleId, locationId, includeSaleGroup);
        log.info("store id {} and includeSaleGroup {} has been updated.", locationId, includeSaleGroup);
    }

}
