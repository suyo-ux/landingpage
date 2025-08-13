"use client";

import { useEffect } from "react";

const SIGNUP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL || "";

export default function SignupPage() {
  useEffect(() => {
    if (SIGNUP_URL) {
      window.location.replace(SIGNUP_URL);
    }
  }, []);

  if (SIGNUP_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">회원가입 페이지로 이동 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 p-6">
        <h1 className="heading text-2xl font-bold mb-4">회원가입</h1>
        <p className="text-sm text-muted mb-6">간단하게 회원가입을 해보세요.</p>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="이름" className="w-full rounded-lg border border-foreground/10 px-3 py-2" />
          <input type="email" placeholder="이메일" className="w-full rounded-lg border border-foreground/10 px-3 py-2" />
          <input type="password" placeholder="비밀번호" className="w-full rounded-lg border border-foreground/10 px-3 py-2" />
          <button className="w-full rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-4 py-2 text-white font-semibold">가입하기</button>
        </form>
      </div>
    </div>
  );
}


