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

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentMap;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.google.common.collect.MapMaker;
import com.tvntd.dao.ArticleRepository;
import com.tvntd.models.Article;
import com.tvntd.models.ArticleRank;
import com.tvntd.service.api.IArticleService;

@Service
@Transactional
@EnableCaching
public class ArticleService implements IArticleService
{
    static private Logger s_log = LoggerFactory.getLogger(ArticleService.class);
    static private ArticleCache s_cache = new ArticleCache();

    @Autowired
    protected ArticleRepository articleRepo;

    public static class ArticleCache
    {
        boolean m_fullCache;
        final ConcurrentMap<String, ArticleDTO> m_cache;

        public ArticleCache()
        {
            m_fullCache = false;
            m_cache = new MapMaker().concurrencyLevel(32).makeMap();
        }

        public ArticleDTO get(String uuid) {
            return m_cache.get(uuid);
        }

        public void put(String uuid, ArticleDTO article)
        {
            if (article != null && uuid != null) {
                m_cache.put(uuid, article);
            }
        }
    }

    public void checkArticleRank(Article art)
    {
        if (art.getArticleRank() == null) {
            art.setArticleRank(new ArticleRank());
        }
    }

    @Override
    public ArticleDTO getArticle(Long artId)
    {
        Article art = articleRepo.findByArticleId(artId);
        checkArticleRank(art);
        return new ArticleDTO(art);
    }

    @Override
    public ArticleDTO getArticle(UUID artUuid)
    {
        String uuid = artUuid.toString();
        ArticleDTO ret = s_cache.get(uuid);
        if (ret == null) {
            Article art = articleRepo.findByArticleUuid(uuid);
            checkArticleRank(art);

            ret = new ArticleDTO(art);
            s_cache.put(uuid, ret);
        }
        return ret;
    }

    @Override
    public List<ArticleDTO> getArticles(List<UUID> uuids)
    {
        List<ArticleDTO> ret = new LinkedList<>();

        for (UUID uuid : uuids) {
            ret.add(getArticle(uuid));
        }
        return ret;
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(Long userId)
    {
        List<Article> articles =
            articleRepo.findAllByAuthorIdOrderByCreatedDateDesc(userId);
        return ArticleDTO.convert(articles);
    }

    @Override
    public List<ArticleDTO> getArticlesByUser(UUID userUuid)
    {
        List<Article> articles =
            articleRepo.findAllByAuthorUuidOrderByCreatedDateAsc(userUuid.toString());
        return ArticleDTO.convert(articles);
    }

    @Override
    public Page<ArticleDTO> getUserArticles(Long userId)
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "created"));
        Page<Article> page =
            articleRepo.findByAuthorIdOrderByCreatedDateDesc(userId, req);
        List<Article> articles = page.getContent();

        return new PageImpl<ArticleDTO>(
                ArticleDTO.convert(articles), req, page.getTotalElements());
    }

    @Override
    public Page<ArticleDTO> getUserArticles(UUID userUuid)
    {
        Pageable req = new PageRequest(0, 10, new Sort(Sort.Direction.DESC, "created"));
        Page<Article> page =
            articleRepo.findByAuthorUuidOrderByCreatedDateDesc(userUuid, req);
        List<Article> articles = page.getContent();

        return new PageImpl<ArticleDTO>(
                ArticleDTO.convert(articles), req, page.getTotalElements());
    }

    @Override
    public void saveArticle(ArticleDTO article) {
        saveArticle(article.fetchArticle());
    }

    @Override
    public void saveArticle(Article article) {
        articleRepo.save(article);
    }

    @Override
    public void deleteArticle(Article art) {
        articleRepo.delete(art.getArticleId());
    }

    @Override
    public void deleteArticle(UUID uuid)
    {
        ArticleDTO art = getArticle(uuid);
        if (art != null) {
            articleRepo.delete(art.fetchArticle());
        }
    }

    @Override
    public void saveArticles(String jsonFile, String rsDir)
    {
    }
}
