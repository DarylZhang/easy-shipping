package com.easyshopping.repository;

import com.easyshopping.repository.entity.TColesPostcode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ColesPostcodeRepository extends JpaRepository<TColesPostcode, Integer> {

    TColesPostcode findFirstByOrderById();

    TColesPostcode findByPostcode(String postcode);


    TColesPostcode findFirstByStateCodeOrderById(String stateCode);

    List<TColesPostcode> findAllByStateCode(String stateCode);

    @Modifying
    @Query("update TColesPostcode t set t.currentSaleId = :saleId where t.locationId = :locationId and t.includeSaleGroup = :includeSaleGroup")
    void updateCurrentSaleId(@Param("saleId") String saleId, @Param("locationId") String locationId, @Param("includeSaleGroup") String includeSaleGroup);
}
