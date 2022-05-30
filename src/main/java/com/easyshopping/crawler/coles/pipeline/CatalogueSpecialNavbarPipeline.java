package com.easyshopping.crawler.coles.pipeline;

import com.easyshopping.crawler.coles.model.CategoryModel;
import com.easyshopping.crawler.coles.model.ProductModel;
import com.easyshopping.crawler.coles.model.WeekSpecialModel;
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
public class CatalogueSpecialNavbarPipeline implements Pipeline {

    @Autowired
    private ColesService colesService;

    @Override
    public void process(ResultItems resultItems, Task task) {

        if (resultItems.get("categories") != null) {
            String saleId = (String) resultItems.get("saleId");
            String locationId = (String) resultItems.get("locationId");
            String includeSaleGroup = (String) resultItems.get("includeSaleGroup");

            WeekSpecialModel weekSpecialModel = (WeekSpecialModel) resultItems.get("weekSpecial");

            List<CategoryModel> categoryModelList = (List<CategoryModel>) resultItems.get("categories");
            colesService.saveWeekSpecialCategory(saleId, locationId, includeSaleGroup, weekSpecialModel, categoryModelList);
            log.info("Week Special & Categories saved successfully.");
        }

        if (resultItems.get("products") != null) {
            String categoryId = (String) resultItems.get("categoryId");
            String locationId = (String) resultItems.get("locationId");
            List<ProductModel> productModelList = (List<ProductModel>) resultItems.get("products");

            colesService.saveProduct(categoryId, locationId, productModelList);
            log.info("Product saved successfully.");
        }

    }

}
