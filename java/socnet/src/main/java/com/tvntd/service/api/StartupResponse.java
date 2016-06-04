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
package com.tvntd.service.api;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IAuthorService.AuthorDTO;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IProfileService.ProfileDTO;

public class StartupResponse
{
    private LoginResponse      userDTO;
    private List<ProfileDTO>   linkedUsers;
    private List<MenuItemResp> menuItems;
    private List<ArticleDTO>   articles;

    public StartupResponse(ProfileDTO profile, HttpServletRequest reqt)
    {
        if (profile != null) {
            userDTO = new LoginResponse(profile, reqt);
        }
    }

    public List<UUID> getAllUserUuids()
    {
        Map<UUID, UUID> users = new HashMap<>();
        if (linkedUsers != null) {
            for (ProfileDTO prof : linkedUsers) {
                UUID uuid = prof.getUserUuid();
                if (users.get(uuid) == null) {
                    users.put(uuid, uuid);
                }
            }
        }
        if (userDTO != null) {
            List<AuthorDTO> authors = userDTO.getAuthors();
            for (AuthorDTO author : authors) {
                UUID uuid = UUID.fromString(author.getAuthorUuid());
                if (users.get(uuid) == null) {
                    users.put(uuid, uuid);
                }
            }
        }
        if (users.isEmpty()) {
            return null;
        }
        List<UUID> result = new LinkedList<>();
        for (Map.Entry<UUID, UUID> e : users.entrySet()) {
            result.add(e.getKey());
        }
        users.clear();
        return result;
    }

    /**
     * @return the userDTO
     */
    public LoginResponse getUserDTO() {
        return userDTO;
    }

    /**
     * @param userDTO the userDTO to set
     */
    public void setUserDTO(LoginResponse userDTO) {
        this.userDTO = userDTO;
    }

    /**
     * @return the linkedUsers
     */
    public List<ProfileDTO> getLinkedUsers() {
        return linkedUsers;
    }

    /**
     * @param linkedUsers the linkedUsers to set
     */
    public void setLinkedUsers(List<ProfileDTO> linkedUsers) {
        this.linkedUsers = linkedUsers;
    }

    /**
     * @return the menuItems
     */
    public List<MenuItemResp> getMenuItems() {
        return menuItems;
    }

    /**
     * @param menuItems the menuItems to set
     */
    public void setMenuItems(List<MenuItemResp> menuItems) {
        this.menuItems = menuItems;
    }

    /**
     * @return the articles
     */
    public List<ArticleDTO> getArticles() {
        return articles;
    }

    /**
     * @param articles the articles to set
     */
    public void setArticles(List<ArticleDTO> articles) {
        this.articles = articles;
    }
}
