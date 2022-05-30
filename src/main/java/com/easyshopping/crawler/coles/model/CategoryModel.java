package com.easyshopping.crawler.coles.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryModel {

    private String categoryId;
    private String categoryName;
    private Integer productAmount;
}
