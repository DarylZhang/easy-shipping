package com.easyshopping.repository;

import com.easyshopping.repository.entity.TWeekSpecial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeekSpecialRepository extends JpaRepository<TWeekSpecial, Integer> {

    Optional<TWeekSpecial> findByLocationIdAndStatus(String locationId, Integer status);
}
