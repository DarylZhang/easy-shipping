package com.easyshopping.repository.entity;

import lombok.Data;

import javax.persistence.*;
import java.util.Objects;

@Data
@Entity
@Table(name = "coles_basic", schema = "easy_shopping")
public class TColesBasic {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Basic
    @Column(name = "api_key", nullable = false)
    private String apiKey;

    @Basic
    @Column(name = "retailer_id", nullable = false)
    private String retailerId;

    @Basic
    @Column(name = "sale_group", nullable = false)
    private String saleGroup;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TColesBasic that = (TColesBasic) o;
        return Objects.equals(id, that.id) && Objects.equals(apiKey, that.apiKey) && Objects.equals(retailerId, that.retailerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, apiKey, retailerId);
    }
}
