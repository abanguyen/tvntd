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
#ifndef _INCLUDE_CPPTYPE_LOCK_H_
#define _INCLUDE_CPPTYPE_LOCK_H_

#include <pthread.h>

class SpinLock
{
  public:
    SpinLock();

    inline void lock() {
        pthread_mutex_lock(&spin_mtx);
    }
    inline void unlock() {
        pthread_mutex_unlock(&spin_mtx);
    }

  protected:
    pthread_mutex_t  spin_mtx;
};

class SyncLock
{
  public:
    explicit SyncLock(int count = 1);
    ~SyncLock() {}

    void sync_wait();
    void sync_done();
    void sync_adjust_wait(int count);

  protected:
    int              sync_count;
    int              sync_notif;
    pthread_mutex_t  sync_lock;
    pthread_cond_t  *sync_cv;
};

#endif /* _INCLUDE_CPPTYPE_LOCK_H_ */
