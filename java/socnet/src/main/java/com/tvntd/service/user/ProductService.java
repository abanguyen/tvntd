/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
package com.tvntd.service.user;

import java.io.UnsupportedEncodingException;
import java.util.LinkedList;
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.tvntd.dao.ArticleRankRepo;
import com.tvntd.dao.ProductRepository;
import com.tvntd.forms.ProductForm;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Product;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IProductService;

@Service
@Transactional
public class ProductService implements IProductService
{
    static private Logger s_log = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    protected ArticleRankRepo artRankRepo;

    @Autowired
    protected ProductRepository productRepo;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected ICommentService commentSvc;

    /**
     * Common static methods.
     */
    public static void applyPostProduct(ProductForm form, Product prod, boolean publish)
    {
        if (publish == true) {
            prod.markActive();
        } else {
            prod.markPending();
        }
        try {
            String str = form.getProdNotice();
            if (str != null) {
                prod.setProdNotice(str.getBytes("UTF-8"));
            }
            prod.setProdCat(form.getProdCat().getBytes("UTF-8"));
            prod.setProdName(form.getProdName().getBytes("UTF-8"));
            prod.setProdTitle(form.getProdTitle().getBytes("UTF-8"));
            prod.setProdDesc(form.getProdDesc().getBytes("UTF-8"));
            prod.setProdSpec(form.getProdSpec().getBytes("UTF-8"));

            prod.setProdPrice(0L);
            prod.setPriceUnit("$");
            prod.setProdSub("".getBytes("UTF-8"));
            prod.setLogoTag("");

        } catch(UnsupportedEncodingException e) {
            s_log.info(e.getMessage());
        }
    }

    @Override
    public ProductDTO getProductDTO(String uuid)
    {
        Product prod = getProduct(uuid);
        if (prod != null) {
            return new ProductDTO(prod, artRankRepo.findByArticleUuid(uuid));
        }
        return null;
    }

    @Override
    public Product getProduct(String uuid)
    {
        return productRepo.findByArticleUuid(uuid);
    }

    @Override
    public List<ProductDTO> convert(List<Product> products)
    {
        List<ProductDTO> result = new LinkedList<>();
        for (Product p : products) {
            ArticleRank r = artRankRepo.findByArticleUuid(p.getArticleUuid());
            result.add(new ProductDTO(p, r));
        }
        return result;
    }

    @Override
    public List<ProductDTO> getProducts(List<String> uuids)
    {
        List<ProductDTO> result = new LinkedList<>();
        for (String u : uuids) {
            result.add(getProductDTO(u));
        }
        return result;
    }

    @Override
    public List<ProductDTO> getProductsByUser(Long userId)
    {
        List<Product> products = productRepo.findAllByAuthorId(userId);
        if (products != null) {
            return convert(products);
        }
        return null;
    }

    @Override
    public List<ProductDTO> getProductsByUser(String userUuid)
    {
        List<Product> products = productRepo.findAllByAuthorUuid(userUuid);
        if (products != null) {
            return convert(products);
        }
        return null;
    }

    @Override
    public List<ProductDTO> getProductsByUser(List<String> userUuids)
    {
        List<ProductDTO> result = new LinkedList<>();
        for (String u : userUuids) {
            List<ProductDTO> prods = getProductsByUser(u);
            if (prods != null) {
                result.addAll(prods);
            }
        }
        return result;
    }

    @Override
    public List<ProductDTO> getProductsByUser(String[] userUuids)
    {
        List<ProductDTO> result = new LinkedList<>();
        if (userUuids != null) {
            for (String u : userUuids) {
                List<ProductDTO> prods = getProductsByUser(u);
                if (prods != null) {
                    result.addAll(prods);
                }
            }
        }
        return result;
    }

    @Override
    public Page<ProductDTO> getUserProducts(Long userId)
    {
        return null;
    }

    @Override
    public Page<ProductDTO> getUserProducts(String userUuid)
    {
        return null;
    }

    @Override
    public void saveProduct(Product prod)
    {
        productRepo.save(prod);
    }

    @Override
    public void saveProduct(ProductDTO prod)
    {
        artRankRepo.save(prod.fetchRank());
        productRepo.save(prod.fetchProduct());
    }

    @Override
    public void deleteProduct(Product prod)
    {
        productRepo.delete(prod);
    }

    @Override
    public void deleteProduct(String uuid)
    {
    }
}
