package com.easyshopping.crawler.coles.model;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

@Data
public class PostcodeStoreModel {

    @SerializedName("displayName")
    private String displayName;

    @SerializedName("postcode")
    private String postcode;

    @SerializedName("postcodeId")
    private String postcodeId;

    @SerializedName("storeId")
    private String locationId;
}
