package com.easyshopping.crawler.coles.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

@Data
public class SaleIdUrlModel {

    @SerializedName("content")
    private String content;

    @SerializedName("breadcrumb")
    private String breadcrumb;

    @SerializedName("region")
    private String region;
}
