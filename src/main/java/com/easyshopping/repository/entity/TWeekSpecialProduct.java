package com.easyshopping.repository.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "week_special_product", schema = "easy_shopping")
public class TWeekSpecialProduct {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "week_special_id", nullable = false)
//    private Integer weekSpecialId;
//
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "product_id", nullable = false)
//    private Integer productId;

    @Basic
    @Column(name = "product_name", nullable = false, length = -1)
    private String productName;

    @Basic
    @Column(name = "is_half_price", nullable = true)
    private Boolean isHalfPrice;

    @Basic
    @Column(name = "special_price", nullable = true, length = -1)
    private String specialPrice;

    @Basic
    @Column(name = "original_price", nullable = true, length = -1)
    private String originalPrice;

    @Basic
    @Column(name = "saved_price", nullable = true, length = -1)
    private String savedPrice;

    @Basic
    @Column(name = "unit_price", nullable = true, length = -1)
    private String unitPrice;

    @Basic
    @Column(name = "price_unit", nullable = true, length = -1)
    private String priceUnit;

    @Basic
    @Column(name = "unit", nullable = true, length = -1)
    private String unit;

    @Basic
    @Column(name = "product_img_url", nullable = true, length = -1)
    private String productImgUrl;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "week_special_id", referencedColumnName = "id", nullable = false)
    private TWeekSpecial tWeekSpecial;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private TProduct tProduct;

    @Basic
    @Column(name = "store_type", nullable = false)
    private Integer storeType;

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        TColesWeekSpecialProducts that = (TColesWeekSpecialProducts) o;
//        return Objects.equals(weekSpecialId, that.weekSpecialId) && Objects.equals(productsId, that.productsId) && Objects.equals(productName, that.productName) && Objects.equals(isHalfPrice, that.isHalfPrice) && Objects.equals(specialPrice, that.specialPrice) && Objects.equals(originalPrice, that.originalPrice) && Objects.equals(savedPrice, that.savedPrice) && Objects.equals(productImgUrl, that.productImgUrl);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(weekSpecialId, productsId, productName, isHalfPrice, specialPrice, originalPrice, savedPrice, productImgUrl);
//    }
}
