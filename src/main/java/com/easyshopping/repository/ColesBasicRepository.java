package com.easyshopping.repository;

import com.easyshopping.repository.entity.TColesBasic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColesBasicRepository extends JpaRepository<TColesBasic, Integer> {

    TColesBasic findOneById(Integer id);
}
