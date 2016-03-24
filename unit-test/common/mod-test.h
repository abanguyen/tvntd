/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
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
#ifndef _UNIT_TEST_MOD_TEST_H_
#define _UNIT_TEST_MOD_TEST_H_

#include <foss/gtest/gtest.h>
#include <di/request.h>

class RequestTest : public Request
{
  public:
    OBJECT_COMMON_DEFS(RequestTest);

    void req_exec_task() override;
    void req_done_notif() override;

  protected:
    int                   req_no;
    int                   req_cnt;
    ThreadPool::ptr       tpool;

    virtual ~RequestTest();
    explicit RequestTest(int no, int cnt, ThreadPool::ptr tp) :
        req_no(no), req_cnt(cnt), tpool(tp) {}
};

class RequestTestInst : public ::testing::Test
{
  public:
    explicit RequestTestInst() {}
    virtual ~RequestTestInst() {}

    void SetUp() override;
    void TearDown() override;
};

class ThreadPoolTest : public ::testing::Test
{
  public:
    explicit ThreadPoolTest() {}
    virtual ~ThreadPoolTest() {}

    void SetUp() override;
    void TearDown() override;

  protected:
    ThreadPool::ptr          tpool;
};

#endif /* _UNIT_TEST_MOD_TEST_H_ */
