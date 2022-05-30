package com.easyshopping.repository;

import com.easyshopping.repository.entity.TProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<TProduct, Integer> {

    TProduct findByProductIdAndStoreType(String productId, Integer storeType);

    List<TProduct> findAllByStoreType(Integer storeType);
}
