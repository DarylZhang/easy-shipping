package com.easyshopping.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Data
@Entity
@Table(name = "coles_postcode", schema = "easy_shopping")
@AllArgsConstructor
public class TColesPostcode {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "postcode", nullable = false)
    private String postcode;

    @Basic
    @Column(name = "state_code", nullable = false)
    private String stateCode;

    @Basic
    @Column(name = "region_code", nullable = true)
    private String regionCode;

    @Basic
    @Column(name = "postcode_id", nullable = true)
    private String postcodeId;

    @Basic
    @Column(name = "location_id", nullable = true)
    private String locationId;

    @Basic
    @Column(name = "include_sale_group", nullable = true)
    private String includeSaleGroup;

    @Basic
    @Column(name = "update_timestamp", nullable = true)
    private Timestamp updateTimestamp;

    @Basic
    @Column(name = "current_sale_id", nullable = true)
    private String currentSaleId;

    public TColesPostcode() {

    }

    public TColesPostcode(String postcode, String stateCode, String regionCode) {
        this.postcode = postcode;
        this.stateCode = stateCode;
        this.regionCode = regionCode;
        this.updateTimestamp = new Timestamp(new java.util.Date().getTime());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TColesPostcode tPostcode = (TColesPostcode) o;
        return Objects.equals(id, tPostcode.id) && Objects.equals(postcode, tPostcode.postcode) && Objects.equals(stateCode, tPostcode.stateCode) && Objects.equals(regionCode, tPostcode.regionCode) && Objects.equals(updateTimestamp, tPostcode.updateTimestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, postcode, stateCode, regionCode, updateTimestamp);
    }
}
