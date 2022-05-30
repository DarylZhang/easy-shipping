package com.easyshopping.repository.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "category", schema = "easy_shopping")
public class TCategory {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "category_id", nullable = false, length = -1)
    private String categoryId;

    @Basic
    @Column(name = "category_name", nullable = false, length = -1)
    private String categoryName;

    @Basic
    @Column(name = "store_type", nullable = false)
    private Integer storeType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            schema = "easy_shopping",
            name = "category_product",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<TProduct> tProductList;

    @OneToMany(mappedBy = "tCategory")
    private  List<TWeekSpecialCategory> tWeekSpecialCategoryList;

    public TCategory(String categoryId, String categoryName, Integer storeType) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.storeType = storeType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TCategory that = (TCategory) o;
        return Objects.equals(id, that.id) && Objects.equals(categoryId, that.categoryId) && Objects.equals(categoryName, that.categoryName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, categoryId, categoryName);
    }
}
