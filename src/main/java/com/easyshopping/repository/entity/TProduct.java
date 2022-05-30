package com.easyshopping.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product", schema = "easy_shopping")
public class TProduct {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "product_name", nullable = false, length = -1)
    private String productName;

    @Basic
    @Column(name = "product_id", nullable = false, length = -1)
    private String productId;

    @Basic
    @Column(name = "original_price", nullable = true, length = -1)
    private String originalPrice;

    @Basic
    @Column(name = "product_img_url", nullable = true, length = -1)
    private String productImgUrl;

//    @OneToMany(mappedBy = "tColesProduct")
//    private Set<TColesCategoryProduct> tColesCategoryProductSet;
    @ManyToMany(mappedBy = "tProductList", fetch = FetchType.LAZY)
    private List<TCategory> tCategoryList;

    @OneToMany(mappedBy = "tProduct")
    private Set<TColesProductPriceHistory> tColesProductPriceHistorySet;

    @OneToMany(mappedBy = "tProduct")
    private List<TWeekSpecialProduct> tWeekSpecialProductsList;

    @Basic
    @Column(name = "store_type", nullable = false)
    private Integer storeType;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TProduct that = (TProduct) o;
        return Objects.equals(id, that.id) && Objects.equals(productName, that.productName) && Objects.equals(productId, that.productId) && Objects.equals(originalPrice, that.originalPrice) && Objects.equals(productImgUrl, that.productImgUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, productName, productId, originalPrice, productImgUrl);
    }
}
