package com.easyshopping.crawler.coles.service;

import com.easyshopping.crawler.Constant;
import com.easyshopping.crawler.coles.model.*;
import com.easyshopping.repository.*;
import com.easyshopping.repository.entity.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ColesService {

    @Autowired
    private ColesPostcodeRepository postcodeRepository;

    @Autowired
    private ColesBasicRepository colesBasicRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WeekSpecialCategoryRepository weekSpecialCategoryRepository;

    @Autowired
    private WeekSpecialProductRepository weekSpecialProductRepository;

    @Autowired
    private WeekSpecialRepository weekSpecialRepository;

    public TColesBasic getColesBasicInfo() {
        return colesBasicRepository.findOneById(1);
    }

    @Transactional
    public void updateColesPostcode(List<PostcodeRegionModel> postcodeRegionList) {
        List<TColesPostcode> tColesPostcodeList = postcodeRepository.findAll();

        if (tColesPostcodeList.isEmpty()) {
            tColesPostcodeList = new ArrayList<>();

            for (PostcodeRegionModel postcodeRegion : postcodeRegionList) {
                TColesPostcode tPostcode = new TColesPostcode(postcodeRegion.getPostcode(),
                        postcodeRegion.getStateCode(), postcodeRegion.getRegionCode());

                tColesPostcodeList.add(tPostcode);
            }

            postcodeRepository.saveAll(tColesPostcodeList);
        }
    }

    public void updateCOlesPostcodeStore(PostcodeStoreModel postcodeStore) {
        TColesPostcode tColesPostcode = postcodeRepository.findByPostcode(postcodeStore.getPostcode());

        tColesPostcode.setPostcodeId(postcodeStore.getPostcodeId());
        tColesPostcode.setLocationId(postcodeStore.getLocationId());

        postcodeRepository.save(tColesPostcode);
    }

    public List<TColesPostcode> findAllColesPostcode() {

        return postcodeRepository.findAll();
    }

    public List<TColesPostcode> findAllByStateCode(String stateCode) {

        return postcodeRepository.findAllByStateCode(stateCode);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateCurrentSaleId(String saleId, String storeId, String includeSaleGroup) {

        postcodeRepository.updateCurrentSaleId(saleId, storeId, includeSaleGroup);

    }

    @Transactional(rollbackFor = Exception.class)
    public void saveWeekSpecialCategory(String saleId, String locationId, String includeSaleGroup,
                                        WeekSpecialModel weekSpecialModel, List<CategoryModel> categoryModelList) {

        TWeekSpecial tWeekSpecial = null;
        List<TWeekSpecial> weekSpecialList = weekSpecialRepository.findAll();

        if (!weekSpecialList.isEmpty() && !weekSpecialList.stream().anyMatch(ws -> ws.getPublishDate().equals(weekSpecialModel.getPublishDate()))) {
            weekSpecialList.forEach(ws -> ws.setStatus(Constant.WEEK_SPECIAL_STATUS_INACTIVE));
        }

        if (weekSpecialList.isEmpty() || !weekSpecialList.stream().anyMatch(ws -> ws.getPublishDate().equals(weekSpecialModel.getPublishDate()) && ws.getLocationId().equals(locationId))) {
            tWeekSpecial = new TWeekSpecial(weekSpecialModel.getSaleName(),
                    weekSpecialModel.getPublishDate(), weekSpecialModel.getStartDate(),
                    weekSpecialModel.getEndDate(), weekSpecialModel.getOfferText(), saleId, locationId,
                    includeSaleGroup, Constant.STORE_COLES, Constant.WEEK_SPECIAL_STATUS_ACTIVE);
            tWeekSpecial.setCreatedAt(new Timestamp(new Date().getTime()));
            tWeekSpecial = weekSpecialRepository.save(tWeekSpecial);
        }

        if (tWeekSpecial == null) {
            return;
        }

        List<TCategory> tCategoryList = categoryRepository.findAll();
        for (CategoryModel categoryModel : categoryModelList) {

            if (tCategoryList.isEmpty() || !tCategoryList.stream().anyMatch(category -> categoryModel.getCategoryName().equals(category.getCategoryName()))) {
                TCategory tCategory = new TCategory(categoryModel.getCategoryId(), categoryModel.getCategoryName(), Constant.STORE_COLES);
                tCategoryList.add(tCategory);
            }
        }

        if (!tCategoryList.isEmpty()) {
            tCategoryList = categoryRepository.saveAll(tCategoryList);

            List<TWeekSpecialCategory> tWeekSpecialCategoryList = new ArrayList<>();
            for (TCategory tCategory : tCategoryList) {
                CategoryModel categoryModel = categoryModelList.stream()
                        .filter(categoryM -> tCategory.getCategoryName().equals(categoryM.getCategoryName()))
                        .findFirst().get();
                TWeekSpecialCategory tWeekSpecialCategory = new TWeekSpecialCategory(tWeekSpecial, tCategory,
                        categoryModel.getProductAmount(), Constant.STORE_COLES);

                tWeekSpecialCategoryList.add(tWeekSpecialCategory);
            }

            weekSpecialCategoryRepository.saveAll(tWeekSpecialCategoryList);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void saveProduct(String categoryId, String locationId, List<ProductModel> productModelList) {

        List<ProductModel> list = productModelList.stream().filter(pm -> StringUtils.isBlank(pm.getOriginalPrice()) && StringUtils.isBlank(pm.getSpecialPrice())).collect(Collectors.toList());

        TCategory tCategory = categoryRepository.findByCategoryId(categoryId);
        List<TProduct> productList = productRepository.findAllByStoreType(Constant.STORE_COLES);
        List<TProduct> newProductList = new ArrayList<>();

        for (ProductModel productModel : productModelList) {
            TProduct tProduct = productList.stream()
                    .filter(p -> p.getProductId().equals(productModel.getProductId()))
                    .findFirst()
                    .orElse(null);

            if (tProduct == null) {
                tProduct = TProduct.builder()
                        .productId(productModel.getProductId())
                        .productName(productModel.getProductName())
                        .originalPrice(StringUtils.isBlank(productModel.getOriginalPrice()) ? productModel.getSpecialPrice() : productModel.getOriginalPrice())
                        .productImgUrl(productModel.getProductImgUrl())
                        .storeType(Constant.STORE_COLES).build();
            } else {
                tProduct.setOriginalPrice(StringUtils.isBlank(productModel.getOriginalPrice()) ? productModel.getSpecialPrice() : productModel.getOriginalPrice());
                tProduct.setProductImgUrl(productModel.getProductImgUrl());
            }

            newProductList.add(tProduct);
        }

        if (!CollectionUtils.isEmpty(newProductList)) {
            newProductList = productRepository.saveAllAndFlush(newProductList);
            tCategory.setTProductList(newProductList);
            categoryRepository.saveAndFlush(tCategory);
        }

        TWeekSpecial tWeekSpecial = weekSpecialRepository.findByLocationIdAndStatus(locationId, Constant.WEEK_SPECIAL_STATUS_ACTIVE).get();
        List<TWeekSpecialProduct> tWeekSpecialProductList = weekSpecialProductRepository.findAllByTWeekSpecial(tWeekSpecial.getId());
        List<TWeekSpecialProduct> newWeekSpecialProductList = new ArrayList<>();

        for (TProduct newProduct : newProductList) {

            if (tWeekSpecialProductList.stream()
                    .anyMatch(wsp -> wsp.getTProduct().getId().equals(newProduct.getId()))) {
                continue;
            }

            ProductModel productModel = productModelList.stream()
                    .filter(p -> p.getProductId().equals(newProduct.getProductId()))
                    .findFirst()
                    .orElse(null);
            TWeekSpecialProduct tWeekSpecialProduct = new TWeekSpecialProduct();

            tWeekSpecialProduct.setTWeekSpecial(tWeekSpecial);
            tWeekSpecialProduct.setTProduct(newProduct);

            tWeekSpecialProduct.setProductName(productModel.getProductName());
            tWeekSpecialProduct.setIsHalfPrice(productModel.getIsHalfPrice());
            tWeekSpecialProduct.setProductImgUrl(productModel.getProductImgUrl());
            tWeekSpecialProduct.setOriginalPrice(StringUtils.isBlank(productModel.getOriginalPrice())
                    ? productModel.getSpecialPrice() : productModel.getOriginalPrice());
            tWeekSpecialProduct.setSpecialPrice(productModel.getSpecialPrice());
            tWeekSpecialProduct.setSavedPrice(StringUtils.isBlank(productModel.getSavedPrice()) ? "0.00" : productModel.getSavedPrice());
            tWeekSpecialProduct.setUnit(productModel.getUnit());
            tWeekSpecialProduct.setPriceUnit(productModel.getPriceUnit());
            tWeekSpecialProduct.setStoreType(Constant.STORE_COLES);

            newWeekSpecialProductList.add(tWeekSpecialProduct);
        }

        weekSpecialProductRepository.saveAll(newWeekSpecialProductList);

    }
}
