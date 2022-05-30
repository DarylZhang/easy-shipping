package com.easyshopping.repository;

import com.easyshopping.repository.entity.TCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<TCategory, Integer> {

    TCategory findByCategoryId(String categoreId);
}
