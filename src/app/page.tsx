"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiStar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiChevronRight,
  FiPhone,
  FiMessageCircle,
} from "react-icons/fi";
// Prefer static path from public for reliability
const heroImagePath = "/hero.jpg";
import club1 from "../club1.jpg";
import club2 from "../club2.jpg";
import club3 from "../club3.jpg";
import club4 from "../club4.jpg";

type Weather = {
  temperature: number | null;
  description: string | null;
};

function AnimatedCounter({ to, suffix = "+", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(progress * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const [now, setNow] = useState<string>("");
  const [weather, setWeather] = useState<Weather>({ temperature: null, description: null });
  const [activeCrews, setActiveCrews] = useState<number>(186);

  useEffect(() => {
    const t = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(t);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    const next = isDark ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      const s = d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
      setNow(s);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const jitter = setInterval(() => {
      setActiveCrews((n) => Math.max(120, Math.min(320, n + (Math.random() > 0.5 ? 1 : -1))));
    }, 1500);
    return () => clearInterval(jitter);
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`; 
          const res = await fetch(url);
          const json = await res.json();
          const code = json?.current?.weather_code as number | undefined;
          const temp = json?.current?.temperature_2m as number | undefined;
          setWeather({ temperature: temp ?? null, description: weatherCodeToKorean(code) });
        } catch {}
      },
      () => {
        // Fallback: Seoul
        (async () => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code`;
            const res = await fetch(url);
            const json = await res.json();
            const code = json?.current?.weather_code as number | undefined;
            const temp = json?.current?.temperature_2m as number | undefined;
            setWeather({ temperature: temp ?? null, description: weatherCodeToKorean(code) });
          } catch {}
        })();
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 3000 }
    );
  }, []);

  const features = useMemo(
    () => [
      { title: "레벨별 맞춤 크루", desc: "초보자부터 마라토너까지", iconBg: "bg-orange-500" },
      { title: "우리 동네에서", desc: "지역 기반 크루 매칭", iconBg: "bg-blue-500" },
      { title: "검증된 멤버", desc: "안전하고 신뢰할 수 있는 구성원", iconBg: "bg-emerald-500" },
      { title: "목표 달성", desc: "개인/그룹 목표 설정 및 달성", iconBg: "bg-purple-500" },
      { title: "실시간 소통", desc: "크루 채팅 및 일정 공유", iconBg: "bg-pink-500" },
      { title: "러닝 후 모임", desc: "카페, 식사 등 소셜 활동", iconBg: "bg-indigo-500" },
    ],
    []
  );

  const crews = useMemo(
    () => [
      {
        name: "선셋 러너스",
        region: "서울 · 한강",
        time: "평일 19:30",
        members: 42,
        pace: `5'30"`,
        desc: "퇴근 후 노을과 함께 달리는 도심 러닝 크루",
        img: club1,
      },
      {
        name: "모닝 스프린트",
        region: "분당 · 탄천",
        time: "주말 07:00",
        members: 28,
        pace: `6'00"`,
        desc: "아침 햇살과 함께 상쾌하게 시작하는 주말 러닝",
        img: club2,
      },
      {
        name: "마라톤 준비반",
        region: "부산 · 광안리",
        time: "수/토 20:00",
        members: 36,
        pace: `5'00"`,
        desc: "하프/풀 완주를 목표로 체계적 훈련",
        img: club3,
      },
      {
        name: "소셜 조깅",
        region: "대구 · 수성못",
        time: "토 10:30",
        members: 31,
        pace: `6'30"`,
        desc: "수다 떨며 가볍게 달리는 친목 중심",
        img: club4,
      },
    ],
    []
  );

  const schedule = useMemo(
    () => [
      { date: "월 8/12", time: "19:30", place: "뚝섬 유원지", km: 7, people: 18 },
      { date: "수 8/14", time: "20:00", place: "여의나루", km: 10, people: 24 },
      { date: "금 8/16", time: "19:30", place: "반포 한강공원", km: 8, people: 21 },
      { date: "일 8/18", time: "07:00", place: "탄천 합수부", km: 12, people: 12 },
    ],
    []
  );

  const reviews = useMemo(
    () => [
      { name: "민지", age: 27, period: "6개월", text: "혼자선 꾸준히 못했는데 크루 덕분에 10km 완주!", rating: 5 },
      { name: "현우", age: 31, period: "3개월", text: "분위기가 밝고 친절해요. 러닝이 즐거워졌어요.", rating: 5 },
      { name: "서연", age: 24, period: "1년", text: "마라톤 첫 완주! 함께라서 가능했습니다.", rating: 5 },
    ],
    []
  );

  const [reviewIndex, setReviewIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setReviewIndex((i) => (i + 1) % reviews.length), 4000);
    return () => clearInterval(id);
  }, [reviews.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-24 -left-16 h-80 w-80 rounded-full blob"
          style={{ background: "radial-gradient(circle at 30% 30%, #fb923c66, transparent 60%)" }}
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-0 h-96 w-96 rounded-full blob"
          style={{ background: "radial-gradient(circle at 70% 30%, #a78bfa66, transparent 60%)" }}
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-3 rounded-2xl glass px-4 py-3 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500" />
              <span className="heading text-lg font-semibold">RunCrew</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-accent transition-colors">크루소개</a>
              <a href="#schedule" className="hover:text-accent transition-colors">일정</a>
              <a href="#reviews" className="hover:text-accent transition-colors">후기</a>
              <a href="/signup" className="hover:text-accent transition-colors">가입하기</a>
            </nav>
            <div className="flex items-center gap-2">
              <button aria-label="Toggle theme" onClick={toggleTheme} className="inline-flex h-9 w-9 items-center justify-center rounded-full glass">
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>
              <a href="/signup" className="hidden sm:inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-5 py-2 text-white font-semibold shadow-md btn-gradient">
                지금 가입하기
              </a>
              <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full glass" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <FiMenu />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute right-4 top-4 w-[85%] max-w-xs rounded-2xl glass p-6 text-foreground" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <span className="heading text-xl font-semibold">RunCrew</span>
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="h-9 w-9 inline-flex items-center justify-center rounded-full glass">
                  <FiX />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                <a onClick={() => setMobileOpen(false)} href="#features" className="hover:text-accent">크루소개</a>
                <a onClick={() => setMobileOpen(false)} href="#schedule" className="hover:text-accent">일정</a>
                <a onClick={() => setMobileOpen(false)} href="#reviews" className="hover:text-accent">후기</a>
                <a onClick={() => setMobileOpen(false)} href="/signup" className="hover:text-accent">가입하기</a>
              </nav>
              <a href="/signup" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 text-white font-semibold btn-gradient">무료로 시작하기</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-36 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="heading text-4xl font-bold sm:text-5xl lg:text-6xl"
            >
              <span className="gradient-text">함께 달리면 더 멀리</span> 갈 수 있어요
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-lg text-muted"
            >
              새로운 러닝 메이트를 만나고, 목표를 세우고, 성취의 기쁨을 함께 느껴봐요.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/signup" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 btn-gradient">
                무료로 시작하기
              </a>
              <a href="#crews" className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-8 py-3 font-semibold hover:bg-foreground/5">
                크루 둘러보기
              </a>
            </motion.div>

            {/* Info chips */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <FiClock className="text-accent" />
                <div>
                  <div className="text-xs text-muted">현재 시간</div>
                  <div className="text-sm font-semibold">{now || "--:--"}</div>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <FiMapPin className="text-accent" />
                <div>
                  <div className="text-xs text-muted">날씨</div>
                  <div className="text-sm font-semibold">
                    {weather.temperature !== null ? `${Math.round(weather.temperature)}°C` : "--"} · {weather.description ?? "상쾌한 날씨"}
                  </div>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <FiUsers className="text-accent" />
                <div>
                  <div className="text-xs text-muted">현재 활동 중 크루</div>
                  <div className="text-sm font-semibold">{activeCrews}개</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-[340px] rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl"
            >
              <a href="/signup" aria-label="지금 시작하기로 이동" className="group relative h-full w-full overflow-hidden rounded-[22px] block cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/40">
                {/* Background photo */}
                <Image
                  src={heroImagePath}
                  alt="러닝크루 히어로 배경"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/55 transition-colors duration-500 group-hover:bg-black/35" />
                {/* Centered text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="heading text-2xl font-semibold text-white">달리기, 지금 시작!</div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading text-3xl font-bold sm:text-4xl">러닝크루의 특징</h2>
          <p className="mt-3 text-muted">젊고 역동적인 경험을 위한 핵심 가치</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-2xl border border-foreground/10 p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${f.iconBg}`}>
                <FiStar />
              </div>
              <div className="text-lg font-semibold">{f.title}</div>
              <div className="mt-1 text-muted">{f.desc}</div>
              <div className="mt-4 inline-flex items-center text-accent">
                자세히 보기 <FiChevronRight className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Crews */}
      <section id="crews" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="heading text-3xl font-bold sm:text-4xl">이런 크루들이 기다리고 있어요</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {crews.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden border border-foreground/10 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-40 w-full bg-foreground/5">
                <Image src={c.img} alt={c.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{c.name}</div>
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs">{c.pace}</span>
                </div>
                <div className="mt-1 text-sm text-muted">{c.region} · {c.time}</div>
                <div className="mt-2 text-sm"><span className="font-medium">{c.members}</span> 명</div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{c.desc}</p>
                <a href="#cta" className="mt-4 inline-flex items-center text-accent hover:underline">
                  자세히 보기 <FiChevronRight className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="heading text-3xl font-bold sm:text-4xl">이번 주 러닝 일정</h2>
          <p className="mt-2 text-muted">함께 달릴 시간을 정해요</p>
        </div>
        <div className="mx-auto max-w-3xl">
          <ol className="relative border-s border-foreground/10">
            {schedule.map((e, i) => (
              <motion.li
                key={`${e.date}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05 }}
                className="mb-8 ms-8"
              >
                <span className="absolute -start-3 mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ring-2 ring-background" />
                <div className="rounded-xl border border-foreground/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted">{e.date} · {e.time}</div>
                    <div className="text-sm font-medium"><FiMapPin className="mr-1 inline" /> {e.place}</div>
                  </div>
                  <div className="mt-2 text-sm">거리 {e.km}km · 예상 참여 {e.people}명</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading text-3xl font-bold sm:text-4xl">크루원들의 생생한 후기</h2>
        </div>
        <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden">
          <div className="flex" style={{ transform: `translateX(-${reviewIndex * 100}%)`, transition: "transform 600ms ease" }}>
            {reviews.map((r, i) => (
              <div key={i} className="w-full shrink-0 px-2">
                <div className="rounded-2xl border border-foreground/10 p-6">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-foreground/10" />
                    <div>
                      <div className="font-semibold">{r.name} · {r.age}</div>
                      <div className="text-xs text-muted">참여 {r.period}</div>
                    </div>
                  </div>
                  <p className="text-sm">{r.text}</p>
                  <div className="mt-3 text-orange-400">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <FiStar key={idx} className="inline" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button key={i} aria-label={`go to slide ${i + 1}`} onClick={() => setReviewIndex(i)} className={`h-2 w-2 rounded-full ${i === reviewIndex ? "bg-foreground" : "bg-foreground/20"}`} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[{ label: "총 크루 수", value: 150 }, { label: "활성 멤버", value: 2000 }, { label: "완주 기록", value: 500 }, { label: "평균 만족도", value: 4.8, suffix: "/5" }].map((s, i) => (
            <div key={s.label} className="rounded-2xl border border-foreground/10 p-6 text-center">
              <div className="text-3xl font-bold">
                {typeof s.value === "number" && s.label !== "평균 만족도" ? (
                  <AnimatedCounter to={s.value} suffix={s.label === "총 크루 수" ? "+" : "+"} />
                ) : (
                  <span>
                    {s.value}
                    {s.suffix}
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Join process */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="heading text-3xl font-bold sm:text-4xl">3단계로 쉬운 가입</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 items-center gap-6 sm:grid-cols-3">
          {[
            { step: 1, title: "회원가입", desc: "간단한 정보 입력" },
            { step: 2, title: "크루 선택", desc: "나에게 맞는 크루" },
            { step: 3, title: "러닝 시작", desc: "함께 도전하기" },
          ].map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-2xl border border-foreground/10 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">{s.step}</div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-muted">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1">
          <div className="rounded-[22px] bg-background/90 p-8 text-center sm:p-12">
            <h2 className="heading text-3xl font-bold text-foreground sm:text-4xl">오늘부터 새로운 러닝 라이프를 시작하세요</h2>
            <p className="mt-2 text-foreground/80">가입비 무료 · 언제든 탈퇴 가능</p>
            <div className="mt-6 flex items-center justify-center">
              <a href="/signup" className="inline-flex animate-[pulse_2s_ease-in-out_infinite] items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg btn-gradient">
                무료 가입하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div>
            <div className="heading text-xl font-semibold">RunCrew</div>
            <p className="mt-2 text-sm text-muted">건강한 라이프스타일을 위한 러닝 커뮤니티</p>
          </div>
          <div>
            <div className="font-semibold">서비스</div>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-foreground">정기 러닝</a></li>
              <li><a href="#" className="hover:text-foreground">개인 트레이닝</a></li>
              <li><a href="#" className="hover:text-foreground">마라톤 준비</a></li>
              <li><a href="#" className="hover:text-foreground">건강 상담</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">커뮤니티</div>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-foreground">이벤트</a></li>
              <li><a href="#" className="hover:text-foreground">갤러리</a></li>
              <li><a href="#" className="hover:text-foreground">후기</a></li>
              <li><a href="#" className="hover:text-foreground">공지사항</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">연락처</div>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li>📧 info@runcrew.com</li>
              <li>📞 02-1234-5678</li>
              <li>📍 서울시 강남구 러닝로 123</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-muted">© 2025 RunCrew. All rights reserved.</div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3">
        <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg" aria-label="채팅">
          <FiMessageCircle />
        </a>
        <a href="tel:0212345678" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg" aria-label="전화">
          <FiPhone />
        </a>
      </div>
    </div>
  );
}

function weatherCodeToKorean(code?: number): string | null {
  if (code == null) return null;
  const map: Record<number, string> = {
    0: "맑음",
    1: "대체로 맑음",
    2: "부분 흐림",
    3: "흐림",
    45: "안개",
    48: "얼어붙는 안개",
    51: "이슬비",
    53: "약한 비",
    55: "강한 비",
    61: "가벼운 비",
    63: "비",
    65: "강한 비",
    71: "가벼운 눈",
    73: "눈",
    75: "강한 눈",
    80: "소나기",
    95: "천둥번개",
  };
  return map[code] ?? "좋은 날씨";
}
