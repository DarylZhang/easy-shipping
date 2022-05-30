package com.easyshopping.repository.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "week_special", schema = "easy_shopping")
public class TWeekSpecial {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "sale_name", nullable = false, length = -1)
    private String saleName;

    @Basic
    @Column(name = "publish_date", nullable = false, length = -1)
    private String publishDate;

    @Basic
    @Column(name = "start_date", nullable = false, length = -1)
    private String startDate;

    @Basic
    @Column(name = "end_date", nullable = false, length = -1)
    private String endDate;

    @Basic
    @Column(name = "offer_text", nullable = false, length = -1)
    private String offerText;

    @Basic
    @Column(name = "sale_id", nullable = false)
    private String saleId;

    @Basic
    @Column(name = "location_id", nullable = false)
    private String locationId;

    @Basic
    @Column(name = "store_type", nullable = false)
    private Integer storeType;

    @Basic
    @Column(name = "include_sale_group", nullable = false)
    private String includeSaleGroup;

    @Basic
    @Column(name = "created_at", nullable = true)
    private Timestamp createdAt;

    @Basic
    @Column(name = "status", nullable = false)
    private Integer status;

    @OneToMany(mappedBy = "tWeekSpecial", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<TWeekSpecialCategory> tWeekSpecialCategoryList;

    @OneToMany(mappedBy = "tWeekSpecial", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    private List<TWeekSpecialProduct> tWeekSpecialProductsList;

    public TWeekSpecial(String saleName, String publishDate, String startDate, String endDate,
                        String offerText, String saleId, String locationId, String includeSaleGroup,
                        Integer storeType, Integer statue) {
        this.saleName = saleName;
        this.publishDate = publishDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.offerText = offerText;
        this.saleId = saleId;
        this.locationId = locationId;
        this.includeSaleGroup = includeSaleGroup;
        this.storeType = storeType;
        this.status = statue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TWeekSpecial that = (TWeekSpecial) o;
        return Objects.equals(id, that.id) && Objects.equals(saleName, that.saleName) && Objects.equals(publishDate, that.publishDate) && Objects.equals(startDate, that.startDate) && Objects.equals(endDate, that.endDate) && Objects.equals(offerText, that.offerText);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, saleName, publishDate, startDate, endDate, offerText);
    }
}
