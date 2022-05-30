package com.easyshopping.repository.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Objects;

@Data
@Entity
@Table(name = "coles_product_price_history", schema = "easy_shopping")
public class TColesProductPriceHistory {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

//    @Basic
//    @Column(name = "product_id", nullable = false)
//    private Integer productId;

    @Basic
    @Column(name = "price", nullable = false, precision = 2)
    private BigDecimal price;


    @Basic
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private TProduct tProduct;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TColesProductPriceHistory that = (TColesProductPriceHistory) o;
        return Objects.equals(id, that.id) && Objects.equals(price, that.price) && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, price, createdAt);
    }
}
