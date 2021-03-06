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
package com.tvntd.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mongodb.Mongo;
import com.tvntd.dao.AuthorTagRepo.AuthorTagDTO;
import com.tvntd.dao.AuthorTagRepo.AuthorTagRespDTO;
import com.tvntd.forms.UserConnectionForm;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.Author;
import com.tvntd.models.User;
import com.tvntd.objstore.ObjStore;
import com.tvntd.service.api.GenericResponse;
import com.tvntd.service.api.IArtTagService;
import com.tvntd.service.api.IArticleService;
import com.tvntd.service.api.IArticleService.ArticleDTO;
import com.tvntd.service.api.IArticleService.ArticleDTOResponse;
import com.tvntd.service.api.IAuthorService;
import com.tvntd.service.api.IAuthorService.AuthorDTO;
import com.tvntd.service.api.IMenuItemService;
import com.tvntd.service.api.IMenuItemService.MenuItemResp;
import com.tvntd.service.api.IProfileService;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.IUserNotifService;
import com.tvntd.service.api.LoginResponse;
import com.tvntd.service.api.StartupResponse;
import com.tvntd.service.api.UserConnectionChange;
import com.tvntd.service.api.UserNotifResponse;
import com.tvntd.util.Constants;

@Controller
public class ApiPath
{
    static private Logger s_log = LoggerFactory.getLogger(ApiPath.class);
    static private GenericResponse s_genOkResp = new GenericResponse("ok");

    @Autowired
    private IMenuItemService menuItemSvc;

    @Autowired
    private IUserNotifService userNotifSvc;

    @Autowired
    private IArticleService articleSvc;

    @Autowired
    protected IAuthorService authorSvc;

    @Autowired
    protected IArtTagService artTagSvc;

    @Autowired
    protected Mongo mongo;

    @Autowired
    protected CommonsMultipartResolver multipartResolver;

    @Autowired
    protected IProfileService profileSvc;

    /**
     * Handle Api REST calls.
     */
    @RequestMapping(value = "/api/user-notification", method = RequestMethod.GET)
    @ResponseBody
    public UserNotifResponse
    getUserNotification(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        Long userId = menuItemSvc.getPublicId();
        User user = (User) session.getAttribute("user");

        if (user != null) {
            userId = 0L;
        }
        return userNotifSvc.getUserNotif(userId);
    }

    /**
     * Get public user articles.
     */
    @RequestMapping(value = "/api/user-articles", method = RequestMethod.GET)
    @ResponseBody
    public ArticleDTOResponse
    getUserArticles(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            List<ArticleDTO> articles = articleSvc.getArticlesByUser(user.getId());
            return new ArticleDTOResponse(articles, null);
        }
        s_log.info("User is not login");
        return null;
    }

    /**
     * Get user profile.
     */
    @RequestMapping(value = "/api/user", method = RequestMethod.GET)
    @ResponseBody
    public StartupResponse
    getStartupMenu(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        User user = (User) session.getAttribute("user");
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (user == null || profile == null) {
            return null;
        }
        StartupResponse result = new StartupResponse(profile, reqt);
        fillStartupResponse(result, profile,
                profileSvc, authorSvc, menuItemSvc, articleSvc, artTagSvc);
        return result;
    }

    /**
     * Common methods shared by admin and regular user startup response.
     */
    public static void
    fillStartupResponse(StartupResponse resp, ProfileDTO profile,
            IProfileService profileSvc, IAuthorService authorSvc,
            IMenuItemService menuItemSvc, IArticleService articleSvc,
            IArtTagService artTagSvc)
    {
        if (menuItemSvc != null) {
            Long mask = profile.getRoleMask();
            Long userId = ((mask & Constants.Role_Admin) != 0) ?
                menuItemSvc.getAdminId() : menuItemSvc.getPrivateId();
            List<MenuItemResp> items = menuItemSvc.getMenuItemRespByUser(userId);

            if (items != null) {
                resp.setMenuItems(items);
            }
        }
        if (profileSvc != null) {
            resp.setLinkedUsers(profileSvc.getProfileFromRaw(null));
        }
        if (authorSvc != null) {
            fillLoginResponse(resp.getUserDTO(), profile);
            fillAuthorTags(resp, profile, null, authorSvc);
        }
        if (articleSvc != null) {
            List<String> uuids = resp.getAllUserUuids();
            resp.setArticles(articleSvc.getArticlesByUser(uuids));
        }
        resp.setPublicTags(artTagSvc.getUserTagsDTO(Constants.PublicUuid));
    }

    public static void
    fillAuthorTags(StartupResponse resp, ProfileDTO profile,
            List<String> userUuids, IAuthorService authorSvc)
    {
        String myUuid = profile.getUserUuid();
        List<AuthorDTO> authorList = new LinkedList<>();

        AuthorDTO author = authorSvc.getAuthorDTO(myUuid);
        if (author != null) {
            authorList.add(author);
        }
        if (userUuids == null) {
            userUuids = resp.getAllUserUuids();
        }
        if (userUuids != null) {
            for (String uuid : userUuids) {
                if (!myUuid.equals(uuid)) {
                    author = authorSvc.getAuthorDTO(uuid);
                    if (author != null) {
                        authorList.add(author);
                    }
                }
            }
        }
        resp.setAuthors(authorList);
    }

    public static void
    fillLoginResponse(LoginResponse resp, ProfileDTO profile)
    {
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @RequestMapping(value = "/api/upload-img", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImage(@RequestParam("name") String name,
            @RequestParam("file") MultipartFile file,
            MultipartHttpServletRequest reqt, HttpSession session)
    {
        if (file.isEmpty()) {
        }
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");
        if (profile == null) {
            return null;
        }
        try {
            ObjStore store = ObjStore.getInstance();
            InputStream is = file.getInputStream();
            ObjectId oid = store.putImage(is, (int) file.getSize());

            if (oid != null) {
                profileSvc.saveUserImgUrl(profile, oid);
            }
        } catch(IOException e) {
            s_log.info("Exception: " + e.toString());
        }
        return s_genOkResp;
    }

    @RequestMapping(value = "/api/upload-img-list", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse
    uploadImageList(@RequestParam("name") String[] names,
            @RequestParam("file") MultipartFile[] files)
    {
        if (files.length != names.length) {
            return new GenericResponse("failure", "Miss-match input length");
        }
        return s_genOkResp;
    }

    /**
     * Request connect, follow other users.
     */
    @RequestMapping(value = "/api/user-connections",
            consumes = "application/json", method = RequestMethod.POST)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @ResponseBody
    public GenericResponse
    changeUserConnections(@RequestBody UserConnectionForm form,
            HttpServletRequest request, HttpSession session)
    {
        ProfileDTO profile = (ProfileDTO) session.getAttribute("profile");

        if (profile == null) {
            return new GenericResponse("failure", "Invalid session");
        }
        String[] uuids = form.getFollow();
        HashMap<String, ProfileDTO> pending = new HashMap<>();

        if (uuids != null) {
            profileSvc.followProfiles(profile, uuids, pending);
        }
        uuids = form.getConnect();
        if (uuids != null) {
            profileSvc.connectProfiles(profile, uuids, pending);
        }
        if (!pending.isEmpty()) {
            pending.put(profile.getUserUuid(), profile);
            for (Map.Entry<String, ProfileDTO> entry : pending.entrySet()) {
                profileSvc.saveProfile(entry.getValue());
            }
            int i = 0;
            List<String> connect = profile.getConnectList();
            String[] connUuid = new String[connect.size()];
            for (String uuid : connect) {
                connUuid[i++] = uuid.toString();
            }
            i = 0;
            List<String> follow = profile.getFollowList();
            String[] followUuid = new String[follow.size()];
            for (String uuid : follow) {
                followUuid[i++] = uuid.toString();
            }
            form.setFollow(followUuid);
            form.setConnect(connUuid);
        } else {
            form.setFollow(null);
            form.setConnect(null);
        }
        return new UserConnectionChange(form);
    }
}
