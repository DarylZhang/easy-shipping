package com.easyshopping.crawler.coles.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

@Data
public class PostcodeRegionModel {

    @SerializedName("Postcode")
    private String postcode;

    @SerializedName("RegionCode")
    private String regionCode;

    @SerializedName("StateCode")
    private String stateCode;

}
