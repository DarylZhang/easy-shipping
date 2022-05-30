package com.easyshopping.crawler;

import lombok.Data;

@Data
public class Product {

    private String pg; // buying multiple items, item number restriction
    private Price p1; // special price, l4: special price, o: original price
    private ProductDetail a;
    private String pr; // buying multiple items, single price
    private String s9; // product id ?
    private String m; // product brand
    private String n; // product name
    private String s;
    private String pd; // buying multiple items, ad
    private String t; // product pic
    private String u; // some id
    private String u2; // single unit price

    class Price {
        private String l4;
        private String o;

        public String getL4() {
            return l4;
        }

        public void setL4(String l4) {
            this.l4 = l4;
        }

        public String getO() {
            return o;
        }

        public void setO(String o) {
            this.o = o;
        }
    }

    class ProductDetail {
        private String _03;
        private String P8;

        public String get_03() {
            return _03;
        }

        public void set_03(String _03) {
            this._03 = _03;
        }

        public String getP8() {
            return P8;
        }

        public void setP8(String p8) {
            P8 = p8;
        }
    }
}
