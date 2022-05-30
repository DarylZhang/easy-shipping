package com.easyshopping.crawler.coles.model;

import lombok.Data;

@Data
public class ProductModel {

    private String productId;
    private String productName;
    private String originalPrice;
    private String specialPrice;
    private String savedPrice;
    private String productImgUrl;
    private Boolean isHalfPrice;
    private String unitPrice;
    private String priceUnit;
    private String unit;
}
