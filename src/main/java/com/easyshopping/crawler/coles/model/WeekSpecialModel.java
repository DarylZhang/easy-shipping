package com.easyshopping.crawler.coles.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

@Data
public class WeekSpecialModel {

    @SerializedName("content")
    private String content;

    @SerializedName("saleName")
    private String saleName;

    @SerializedName("publishDate")
    private String publishDate;

    @SerializedName("startDate")
    private String startDate;

    @SerializedName("endDate")
    private String endDate;

    @SerializedName("offerText")
    private String offerText;

    @SerializedName("breadcrumb")
    private String breadcrumb;

    @SerializedName("areaName")
    private String areaName;
}
