package com.easyshopping.repository.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "week_special_category", schema = "easy_shopping")
public class TWeekSpecialCategory {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "week_special_id", nullable = false)
//    private Integer weekSpecialId;
//
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "category_id", nullable = false)
//    private Integer categoryId;

    @Basic
    @Column(name = "product_amount", nullable = false)
    private Integer productAmount;

    @Basic
    @Column(name = "store_type", nullable = false)
    private Integer storeType;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "week_special_id", referencedColumnName = "id", nullable = false)
    private TWeekSpecial tWeekSpecial;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = false)
    private TCategory tCategory;

    public TWeekSpecialCategory(TWeekSpecial tWeekSpecial, TCategory tCategory, Integer productAmount, Integer storeType) {
        this.productAmount = productAmount;
        this.tWeekSpecial = tWeekSpecial;
        this.tCategory = tCategory;
        this.storeType = storeType;
    }

    //    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        TColesWeekSpecialCategory that = (TColesWeekSpecialCategory) o;
//        return Objects.equals(weekSpecialId, that.weekSpecialId) && Objects.equals(categoryId, that.categoryId) && Objects.equals(productAmount, that.productAmount);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(weekSpecialId, categoryId, productAmount);
//    }
}
