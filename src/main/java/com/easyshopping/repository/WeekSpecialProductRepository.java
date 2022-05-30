package com.easyshopping.repository;

import com.easyshopping.repository.entity.TWeekSpecialProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WeekSpecialProductRepository extends JpaRepository<TWeekSpecialProduct, Integer> {

    @Query("select t from TWeekSpecialProduct t where t.tWeekSpecial.id = ?1")
    List<TWeekSpecialProduct> findAllByTWeekSpecial(Integer weekSpecialId);
}
