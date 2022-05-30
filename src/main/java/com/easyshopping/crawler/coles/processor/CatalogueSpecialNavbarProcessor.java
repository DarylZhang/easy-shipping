package com.easyshopping.crawler.coles.processor;

import com.easyshopping.crawler.coles.ColesUrlConstant;
import com.easyshopping.crawler.coles.model.CategoryModel;
import com.easyshopping.crawler.coles.model.ProductModel;
import com.easyshopping.crawler.coles.model.WeekSpecialModel;
import com.easyshopping.crawler.coles.service.ColesService;
import com.easyshopping.repository.entity.TColesBasic;
import com.easyshopping.repository.entity.TColesPostcode;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.processor.PageProcessor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Download coles postcode region data
 */
@Slf4j
@Component
public class CatalogueSpecialNavbarProcessor implements PageProcessor {

    @Autowired
    private ColesService colesService;

    @Autowired
    private Gson gson;

    private Site site;

    private List<TColesPostcode> colesPostcodeList;

    private TColesBasic colesBasic;

    private final static String URL_FIND_NAVBAR = "https://embed.salefinder.com.au/catalogue/getNavbar/$saleId/?format=json&retailerId=$retailerId&preview=&locationId=$locationId&includeSaleGroup=$includeSaleGroup&format=jsonp";

    public CatalogueSpecialNavbarProcessor() {
        this.site = Site.me().setRetryTimes(3).setSleepTime(500);
    }

    @Override
    public void process(Page page) {

        if (page.getUrl().toString().equals(ColesUrlConstant.URL_FIND_CATALOGUE_NAVBAR_ENTRY_POINT)) {
            try {
                colesBasic = colesService.getColesBasicInfo();
                colesPostcodeList = colesService.findAllByStateCode("VIC");

                List<String> targetURLs = new ArrayList<>();

                if (targetURLs.isEmpty()) {
                    Map<String, Boolean> map = new HashMap<>();

                    for (TColesPostcode tColesPostcode : colesPostcodeList) {
                        if (map.containsKey(tColesPostcode.getLocationId() + tColesPostcode.getIncludeSaleGroup())) {
                            continue;
                        }

                        String nextTargetUrl = URL_FIND_NAVBAR
                                .replace("$saleId", tColesPostcode.getCurrentSaleId())
                                .replace("$retailerId", colesBasic.getRetailerId())
                                .replace("$includeSaleGroup", tColesPostcode.getIncludeSaleGroup())
                                .replace("$locationId", tColesPostcode.getLocationId());

                        targetURLs.add(nextTargetUrl);
                        map.put(tColesPostcode.getLocationId() + tColesPostcode.getIncludeSaleGroup(), true);
                    }

                    page.addTargetRequests(targetURLs);
                }
            } catch(Exception e){
                e.printStackTrace();
            }

            page.setSkip(true);
        } else if (page.getUrl().toString().indexOf("https://embed.salefinder.com.au/catalogue/getNavbar") == 0) {
            String url = page.getUrl().get();

            String saleId = url.substring(url.indexOf("getNavbar/") + 10, url.indexOf("/?format"));
            String locationId = url.substring(url.indexOf("&locationId=") + 12, url.indexOf("&includeSaleGroup="));
            String includeSaleGroup = url.substring(url.indexOf("&includeSaleGroup=") + 18, url.indexOf("&format"));

            page.putField("saleId", saleId);
            page.putField("locationId", locationId);
            page.putField("includeSaleGroup", includeSaleGroup);

            String navbarJson = page.getRawText();
            navbarJson = navbarJson.substring(navbarJson.indexOf("(") + 1, navbarJson.lastIndexOf(")"));
            WeekSpecialModel weekSpecialModel = gson.fromJson(navbarJson, WeekSpecialModel.class);
            page.putField("weekSpecial", weekSpecialModel);

            String navbarHtml = weekSpecialModel.getContent();

            Document navbarDoc = Jsoup.parse(navbarHtml);

            Element navcategoriesUL = navbarDoc.select("ul#sf-navcategories").isEmpty() ? null : navbarDoc.select("ul#sf-navcategories").get(0);

            if (navcategoriesUL == null) {
                log.error("Get coles category error with URL {}." , page.getUrl().toString());
            }

            Elements categoriesLi = navcategoriesUL.select("li.rocket__navbar__item");

            List<CategoryModel> categoryModelList = new ArrayList();

            for (Element categoryElement : categoriesLi) {
                Element categoryLinkElement = categoryElement.select("a.rocket__navbar__link").get(0);

                if(categoryLinkElement.attributes().get("title").equals("All")) {
                    continue;
                }

                String categoryName = categoryLinkElement.attributes().get("title");
                String categoryId = categoryLinkElement.attributes().get("data-categoryid");

                Element categoryProductAmountElement = categoryLinkElement.select("span.rocket__navbar__pill").get(0);
                String productAmount = categoryProductAmountElement.text();

                CategoryModel category = new CategoryModel(categoryId, categoryName, Integer.valueOf(productAmount));
                categoryModelList.add(category);
            }

            page.putField("categories", categoryModelList);

            List<String> targetUrls = new ArrayList<>();
            for (CategoryModel categoryModel : categoryModelList) {
                targetUrls.add("https://embed.salefinder.com.au/productlist/category/"+saleId+"/?preview=&saleGroup=0&includeSaleGroup="+includeSaleGroup+"&categoryId="+categoryModel.getCategoryId()+"&locationId="+locationId+"&rows_per_page="+categoryModel.getProductAmount());
            }
            page.addTargetRequests(targetUrls);
        } else if (page.getUrl().toString().indexOf("https://embed.salefinder.com.au/productlist/category") == 0) {

            String navbarJson = page.getRawText();
            navbarJson = navbarJson.substring(navbarJson.indexOf("(") + 1, navbarJson.lastIndexOf(")"));
            WeekSpecialModel weekSpecialModel = gson.fromJson(navbarJson, WeekSpecialModel.class);

            String navbarHtml = weekSpecialModel.getContent();

            Document productDoc = Jsoup.parse(navbarHtml);

            Elements productElements = productDoc.select("div.sf-item").isEmpty() ? null : productDoc.select("div.sf-item");

            List<ProductModel> productModelList = new ArrayList<>();
            for (Element productElement : productElements) {
                ProductModel productModel = new ProductModel();

                productModel.setIsHalfPrice(productElement.classNames().contains("sf-halfspecial"));

                Element productImgElement = productElement.select("div.sf-item-container").select("a").select("img").get(0);
                productModel.setProductImgUrl(productImgElement.attributes().get("src"));

                Element productDetailElement = productElement.select("div.sf-item-details").get(0);

                productModel.setProductId(productDetailElement.select("a.sf-item-heading").get(0).attributes().get("data-itemid"));
                productModel.setProductName(productDetailElement.select("a.sf-item-heading").get(0).attributes().get("title"));

                String originalPrice = productDetailElement.select("span.sf-regoptiondesc").isEmpty() ?
                        null : productDetailElement.select("span.sf-regoptiondesc").get(0).text();
                try {
                    if (StringUtils.isNoneBlank(originalPrice) && !"Was".equals(originalPrice) && !"Every Day".equals(originalPrice)
                            && !"Save".equals(originalPrice) && !"Single Sell".equals(originalPrice) && !"RRP".equals(originalPrice)) {
                        originalPrice = originalPrice.substring(originalPrice.indexOf("$") + 1, originalPrice.indexOf(", Save") > 0 ? originalPrice.indexOf(", Save") : originalPrice.indexOf(","));
                        productModel.setOriginalPrice(originalPrice);
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }

                String savedPrice = productDetailElement.select("span.sf-regprice").isEmpty() ? null : productDetailElement.select("span.sf-regprice").get(0).text();
                if (StringUtils.isNoneBlank(savedPrice)) {
                    savedPrice = savedPrice.substring(savedPrice.indexOf("$") + 1);
                    productModel.setSavedPrice(savedPrice);
                }

                String specialPrice = productDetailElement.select("span.sf-pricedisplay").isEmpty() ? null
                        : productDetailElement.select("span.sf-pricedisplay").get(0).text();
                if (StringUtils.isNoneBlank(specialPrice)) {
                    specialPrice = specialPrice.substring(specialPrice.indexOf("$") + 1);
                    productModel.setSpecialPrice(specialPrice);
                }

                try {
                    String unit = productDetailElement.select("span.sf-optionsuffix").isEmpty() ? null
                            : productDetailElement.select("span.sf-optionsuffix").get(0).text();
                    productModel.setUnit(unit);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }

                try {
                    String unitPrice = productDetailElement.select("p.sf-comparativeText").isEmpty() ? null
                            : productDetailElement.select("p.sf-comparativeText").get(0).text();

                    if (StringUtils.isNoneBlank(unitPrice)) {
                        productModel.setUnitPrice(unitPrice.substring(1, unitPrice.indexOf(" per ")));
                        productModel.setPriceUnit(unitPrice.substring(unitPrice.indexOf(" per ") + 5));
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }

                productModelList.add(productModel);
            }

            String url = page.getUrl().get();

            String categoryId = url.substring(url.indexOf("&categoryId=") + 12, url.indexOf("&locationId="));
            String locationId = url.substring(url.indexOf("&locationId=") + 12, url.indexOf("&rows_per_page"));

            page.putField("locationId", locationId);
            page.putField("categoryId", categoryId);
            page.putField("products", productModelList);
        }
    }

    @Override
    public Site getSite() {
        return site;
    }

}
