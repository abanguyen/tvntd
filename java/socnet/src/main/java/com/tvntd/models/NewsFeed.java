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
package com.tvntd.models;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.UniqueConstraint;

import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

@Entity
public class NewsFeed
{
    @Id
    @Column(length = 64)
    private String userUuid;

    private Date lastUpdate;
    private Date lastLogin;

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "AuthorFeed",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "userUuid", "authorUuid"
            }),
            joinColumns = @JoinColumn(name = "userUuid"))
    private List<String> authorUuid;

    public static NewsFeed fromProfile(ProfileDTO profile)
    {
        NewsFeed news = new NewsFeed();
        news.lastUpdate = new Date();
        news.lastLogin = new Date();
        news.setUserUuid(profile.getUserUuid().toString());
        return news;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("Uuid " + userUuid).append("\n")
            .append("last update: ").append(lastUpdate.toString()).append(", ")
            .append("last login: ").append(lastLogin.toString()).append("\n")
            .append(authorUuid).append("\n");
        return sb.toString();
    }

    public void addAuthor(String author)
    {
        if (authorUuid == null) {
            authorUuid = new LinkedList<>();
        }
        Util.<String>addUnique(authorUuid, author);
    }

    public String removeAuthor(String author)
    {
        if (authorUuid != null) {
            return Util.<String>removeFrom(authorUuid, author);
        }
        return null;
    }

    /**
     * @return the userUuid
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @param userUuid the userUuid to set
     */
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
    }

    /**
     * @return the lastUpdate
     */
    public Date getLastUpdate() {
        return lastUpdate;
    }

    /**
     * @param lastUpdate the lastUpdate to set
     */
    public void setLastUpdate(Date lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    /**
     * @return the lastLogin
     */
    public Date getLastLogin() {
        return lastLogin;
    }

    /**
     * @param lastLogin the lastLogin to set
     */
    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    /**
     * @return the authorUuid
     */
    public List<String> getAuthorUuid() {
        return authorUuid;
    }

    /**
     * @param authorUuid the authorUuid to set
     */
    public void setAuthorUuid(List<String> authorUuid) {
        this.authorUuid = authorUuid;
    }
}
