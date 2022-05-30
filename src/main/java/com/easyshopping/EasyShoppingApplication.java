package com.easyshopping;

import com.easyshopping.crawler.coles.ColesCrawler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableScheduling
public class EasyShoppingApplication {

    @Autowired
    private ColesCrawler colesCrawler;

    public static void main(String[] args) {
        SpringApplication.run(EasyShoppingApplication.class, args);
    }

    @Scheduled(fixedDelay = 100000000, initialDelay = 500)
    public void doColesCrawl() {
        colesCrawler.run();
    }

    public static void main(String[] args) {
        System.out.println("Hello PSK");
    }
}
