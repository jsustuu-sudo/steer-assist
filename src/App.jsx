import { useState, useEffect, useRef, useCallback } from “react”;

const C = {
navy:    “#0A1628”,
blue:    “#1B5FA8”,
brand:   “#2E86DE”,
sky:     “#5BA4E6”,
gold:    “#F5A623”,
amber:   “#E8920A”,
white:   “#FFFFFF”,
offwhite:”#F4F7FB”,
slate:   “#64748B”,
muted:   “#94A3B8”,
line:    “#E2E8F0”,
green:   “#10B981”,
red:     “#EF4444”,
};

const PASS   = “steerassist2024”;
const FB_URL  = “https://www.facebook.com/people/Steer-Assist-Driving-School/100089471258940/”;
const IG_URL  = “https://www.instagram.com/steerassist/”;
const WA_URL  = “https://wa.me/61474917491”;
const GR_URL  = “https://share.google/zViQvMSEjYmzqNsg7”;
const PHONE  = “0474917491”;
const PHONE_DISPLAY = “0474 917 491”;
const EMAIL  = “info@steerassist.com.au”;

// EmailJS placeholders – swap these in after creating your free account at emailjs.com
const EJS_SERVICE  = “YOUR_SERVICE_ID”;
const EJS_TEMPLATE = “YOUR_TEMPLATE_ID”;
const EJS_KEY      = “YOUR_PUBLIC_KEY”;

const SUBURBS = [“Clyde”,“Cranbourne”,“Berwick”,“Narre Warren”,“Pakenham”,“Frankston”,“Dromana”,“Warragul”,“Ringwood”,“Heatherton”,“Dandenong”,“Endeavour Hills”];
const TOPICS  = [“Cockpit checks”,“Moving off & stopping”,“Steering control”,“Gears & clutch”,“Junctions”,“Roundabouts”,“Dual carriageways”,“Bay parking”,“Parallel parking”,“Emergency stop”,“Motorway driving”,“Night driving”,“Independent driving”];
const HOURS   = Array.from({length:14},(_,i)=>i+7);
const DURATIONS = [60,90,120];

const uid  = () => Math.random().toString(36).slice(2,10);
const now  = () => new Date().toISOString().split(“T”)[0];
const addD = (d,n) => { const x=new Date(d+“T12:00:00”); x.setDate(x.getDate()+n); return x.toISOString().split(“T”)[0]; };
const fmtD = d => new Date(d+“T12:00:00”).toLocaleDateString(“en-AU”,{weekday:“short”,day:“numeric”,month:“short”,year:“numeric”});
const fmtT = h => { const s=h>=12?“PM”:“AM”; const h12=h%12===0?12:h%12; return `${h12}:00 ${s}`; };
const weekOf = anchor => {
const d=new Date(anchor+“T12:00:00”), day=d.getDay(), mon=new Date(d);
mon.setDate(d.getDate()-(day===0?6:day-1));
return Array.from({length:7},(_,i)=>{ const x=new Date(mon); x.setDate(mon.getDate()+i); return x.toISOString().split(“T”)[0]; });
};

function useLS(k,seed){
const [v,sv]=useState(()=>{try{const s=localStorage.getItem(k);return s?JSON.parse(s):seed;}catch{return seed;}});
const set=u=>{sv(u);try{localStorage.setItem(k,JSON.stringify(u));}catch{}};
return[v,set];
}

const S_STUDENTS=[
{id:“s1”,name:“Priya Sharma”,email:“priya@example.com”,phone:“0412000001”,enrolled:“2025-01-10”,pkg:20,progress:Object.fromEntries(TOPICS.map((t,i)=>[t,i<6])),examReady:false,examDate:null,examResult:null},
{id:“s2”,name:“James Nguyen”,email:“james@example.com”,phone:“0412000002”,enrolled:“2025-02-05”,pkg:10,progress:Object.fromEntries(TOPICS.map(t=>[t,true])),examReady:true,examDate:addD(now(),5),examResult:null},
{id:“s3”,name:“Sophie Wilson”,email:“sophie@example.com”,phone:“0412000003”,enrolled:“2025-03-01”,pkg:15,progress:Object.fromEntries(TOPICS.map((t,i)=>[t,i<2])),examReady:false,examDate:null,examResult:null},
{id:“s4”,name:“Amir Hassan”,email:“amir@example.com”,phone:“0412000004”,enrolled:“2024-11-15”,pkg:10,progress:Object.fromEntries(TOPICS.map(t=>[t,true])),examReady:true,examDate:addD(now(),-10),examResult:“pass”},
];
const S_BOOKINGS=[
{id:“b1”,sid:“s1”,sName:“Priya Sharma”,sEmail:“priya@example.com”,sPhone:“0412000001”,date:now(),hour:9,dur:60,status:“confirmed”,notes:””},
{id:“b2”,sid:“s2”,sName:“James Nguyen”,sEmail:“james@example.com”,sPhone:“0412000002”,date:now(),hour:11,dur:60,status:“confirmed”,notes:””},
{id:“b3”,sid:“s3”,sName:“Sophie Wilson”,sEmail:“sophie@example.com”,sPhone:“0412000003”,date:addD(now(),1),hour:10,dur:90,status:“confirmed”,notes:””},
{id:“b4”,sid:“s2”,sName:“James Nguyen”,sEmail:“james@example.com”,sPhone:“0412000002”,date:addD(now(),5),hour:14,dur:60,status:“exam”,notes:“Driving test!”},
{id:“b5”,sid:“s4”,sName:“Amir Hassan”,sEmail:“amir@example.com”,sPhone:“0412000004”,date:addD(now(),-3),hour:9,dur:60,status:“confirmed”,notes:””},
];
const S_BLOCKED=[
{id:“bl1”,date:addD(now(),3),hour:null,allDay:true,reason:“Personal day”},
{id:“bl2”,date:addD(now(),2),hour:13,allDay:false,reason:“Lunch”},
{id:“bl3”,date:addD(now(),2),hour:14,allDay:false,reason:“Lunch”},
];
const S_TESTS=[
{id:“t1”,name:“Amir Hassan”,text:“Passed first time! The instructor’s VicRoads experience made all the difference.”,stars:5,date:“2025-03-20”},
{id:“t2”,name:“Lena Park”,text:“So patient and clear. I was terrified of highways but now I love driving!”,stars:5,date:“2025-02-14”},
{id:“t3”,name:“Marcus T.”,text:“10 lessons, first-time pass. Worth every cent. Highly recommend!”,stars:5,date:“2025-01-30”},
{id:“t4”,name:“Zara Ahmed”,text:“Best decision I made. Knew exactly what the test examiner was looking for.”,stars:5,date:“2024-12-10”},
];
const G_REVIEWS=[
{name:“Hannah B.”,stars:5,text:“Incredible patience and knowledge. My son passed first attempt!”,ago:“2 weeks ago”},
{name:“Raj Patel”,stars:5,text:“Very professional. Knew exactly what VicRoads examiners want to see.”,ago:“1 month ago”},
{name:“Chloe M.”,stars:5,text:“Made me feel confident from day one. Cannot recommend enough.”,ago:“3 months ago”},
];
const FAQS=[
{q:“How many lessons do I need?”,a:“It depends on your experience level. Most learners need 10-20 hours with a professional instructor on top of their supervised hours. We’ll assess you in your first lesson and give a personalised recommendation.”},
{q:“What areas do you cover?”,a:“We service Clyde, Cranbourne, Berwick, Narre Warren, Pakenham, Frankston, Dromana, Warragul, Ringwood, Heatherton, Dandenong, Endeavour Hills and all surrounding suburbs.”},
{q:“What car will I learn in?”,a:“We use a modern, dual-controlled vehicle so both you and the instructor have full control at all times – keeping you safe while you learn.”},
{q:“Do you pick me up?”,a:“Yes! We offer pick-up and drop-off from your home, school, or workplace within our service areas.”},
{q:“What if I need to cancel?”,a:“We ask for at least 24 hours notice for cancellations or rescheduling. Late cancellations may incur a fee.”},
{q:“How do I book my driving test?”,a:“Once your instructor marks you as exam ready, you can book directly through VicRoads. We’ll guide you through the entire process.”},
{q:“Do you offer intensive courses?”,a:“Yes! If you need to prepare quickly for your test, we offer intensive lesson packages. Contact us to discuss your timeline.”},
{q:“What makes Steer Assist different?”,a:“Our lead instructor is an Ex-VicRoads Licence Testing Officer with 2,500+ tests experience. That means we know exactly what examiners look for – giving you a real edge.”},
];
const PACKAGES=[
{id:“p1”,name:“Single Lesson”,icon:“🚗”,lessons:1,desc:“Perfect for a trial or top-up session. Get a feel for our teaching style.”,features:[“1 hour lesson”,“Pick-up & drop-off”,“Personalised feedback”],popular:false},
{id:“p2”,name:“5-Lesson Pack”,icon:“5 star”,lessons:5,desc:“Great starter pack. Build core skills with structured sessions.”,features:[“5 x 1 hour lessons”,“Pick-up & drop-off”,“Progress tracking”,“Topic checklist”],popular:false},
{id:“p3”,name:“10-Lesson Pack”,icon:“🏆”,lessons:10,desc:“Best value for learners aiming for a first-time test pass.”,features:[“10 x 1 hour lessons”,“Pick-up & drop-off”,“Full progress tracking”,“Exam readiness assessment”,“Test prep session”],popular:true},
];

const GLOBAL_CSS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;} body{background:#0A1628;font-family:'Plus Jakarta Sans',sans-serif;} .sa-app{font-family:'Plus Jakarta Sans',sans-serif;background:#F4F7FB;min-height:100vh;position:relative;overflow-x:hidden;} .sa-page{padding-bottom:76px;min-height:100vh;} .sa-nav{position:fixed;bottom:0;left:0;width:100%;background:linear-gradient(180deg,#1B5FA8 0%,#0A1628 100%);display:flex;z-index:200;padding-bottom:env(safe-area-inset-bottom,6px);box-shadow:0 -2px 20px rgba(0,0,0,0.4);} .sa-nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 2px 5px;background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.45);font-size:9px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.2s;letter-spacing:0.3px;} .sa-nav-btn.active{color:#fff;} .sa-nav-btn.active svg{filter:drop-shadow(0 0 6px rgba(91,164,230,0.8));} .sa-nav-btn span{margin-top:1px;} .sa-topnav{display:none;position:fixed;top:0;left:0;right:0;z-index:300;background:linear-gradient(90deg,#0A1628 0%,#1B5FA8 100%);box-shadow:0 2px 20px rgba(0,0,0,0.4);padding:0 40px;height:64px;align-items:center;justify-content:space-between;} .sa-topnav-btn{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;padding:8px 12px;border-radius:8px;transition:all 0.2s;} .sa-topnav-btn:hover{color:#fff;background:rgba(255,255,255,0.1);} .sa-topnav-btn.active{color:#fff;background:rgba(255,255,255,0.15);} .sa-topnav-cta{background:linear-gradient(135deg,#F5A623,#E8920A);border:none;cursor:pointer;color:#0A1628;font-size:13px;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;padding:9px 20px;border-radius:10px;transition:all 0.2s;} .sa-topnav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(245,166,35,0.4);} @media(min-width:768px){ .sa-app{max-width:100%;} .sa-hero-inner{max-width:960px;margin:0 auto;} .sa-stats-grid{max-width:900px;margin:20px auto 0!important;} .sa-section-wrap{max-width:900px;margin:0 auto;padding:0 32px;} .sa-pkg-track{justify-content:center!important;} .sa-features-grid{grid-template-columns:repeat(2,1fr)!important;} } @media(min-width:1024px){ .sa-page{padding-bottom:0!important;padding-top:64px;} .sa-nav{display:none!important;} .sa-topnav{display:flex!important;} .sa-hero-inner{max-width:1200px;padding:60px 60px 0!important;display:grid!important;grid-template-columns:1fr 1fr;gap:60px;align-items:center;} .sa-stats-grid{max-width:1200px;margin:32px auto 0!important;border-radius:20px!important;} .sa-section-wrap{max-width:1200px;margin:0 auto;padding:0 60px!important;} .sa-pkg-track{gap:24px!important;} .sa-pkg-card{width:320px!important;} .sa-features-grid{grid-template-columns:repeat(4,1fr)!important;} .sa-page-inner{max-width:900px;margin:0 auto;padding:0 40px;} } @keyframes roadMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}} @keyframes slideOut{from{width:0;opacity:0}to{width:170px;opacity:1}} @keyframes swipeHint{0%{transform:translateX(0);opacity:1}50%{transform:translateX(-8px);opacity:0.5}100%{transform:translateX(0);opacity:1}} .hero-road{animation:roadMove 5s linear infinite;} .fade-up{animation:fadeUp 0.6s ease both;} .fade-up-1{animation-delay:0.1s;} .fade-up-2{animation-delay:0.2s;} .fade-up-3{animation-delay:0.3s;} .shimmer-badge{background:linear-gradient(90deg,#F5A623 25%,#FFD07B 50%,#F5A623 75%);background-size:200% 100%;animation:shimmer 2s infinite;} .phone-pill{animation:slideOut 0.3s ease forwards;} .swipe-hint{animation:swipeHint 2s ease 1.5s 2;} .pkg-card{transition:transform 0.2s,box-shadow 0.2s;} .pkg-card:hover{transform:translateY(-4px);} .pkg-card:active{transform:scale(0.97);} .faq-answer{overflow:hidden;transition:max-height 0.35s ease,opacity 0.3s ease;} .slot-btn{transition:background 0.15s,transform 0.1s;} .slot-btn:active:not(:disabled){transform:scale(0.92);} .sa-input:focus{border-color:#2E86DE!important;outline:none;box-shadow:0 0 0 3px rgba(46,134,222,0.15);}`;

const I = ({n,s=20,c=“currentColor”,fw=2})=>{
const P={
home:“M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10”,
cal:“M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z”,
user:“M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z”,
bar:“M18 20V10M12 20V4M6 20v-6”,
star:“M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z”,
lock:“M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4”,
mail:“M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6”,
phone:“M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.92a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z”,
check:“M20 6L9 17l-5-5”,
x:“M18 6L6 18M6 6l12 12”,
plus:“M12 5v14M5 12h14”,
chevL:“M15 18l-6-6 6-6”,
chevR:“M9 18l6-6-6-6”,
chevD:“M6 9l6 6 6-6”,
chevU:“M18 15l-6-6-6 6”,
award:“M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12”,
car:“M5 17H3v-5l2-6h14l2 6v5h-2m0 0a2 2 0 0 1-4 0m4 0H7m0 0a2 2 0 0 1-4 0M3 12h18M7 8h10”,
map:“M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z”,
download:“M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3”,
trophy:“M6 9H2V3h4v6zm16-6h-4v6h4V3zM12 19v3m-4 0h8M8 19h8M12 15a7 7 0 0 0 7-7V3H5v5a7 7 0 0 0 7 7z”,
logout:“M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9”,
ig:“M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z”,
fb:“M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z”,
trash:“M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6”,
edit:“M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z”,
question:“M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01”,
road:“M12 2L4 20h16L12 2z”,
shield:“M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z”,
};
return(
<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={fw} strokeLinecap="round" strokeLinejoin="round">
{(P[n]||””).split(” M”).map((p,i)=><path key={i} d={(i===0?p:“M”+p)} />)}
</svg>
);
};

const Stars=({n=5,s=14})=><span style={{color:C.gold,fontSize:s,letterSpacing:1}}>{”*”.repeat(n)}{”*”.repeat(5-n)}</span>;

const Logo=({size=40})=>(

  <div style={{width:size,height:size,background:"#fff",borderRadius:size*0.18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 12px rgba(0,0,0,0.25)",overflow:"hidden",padding:size*0.06}}>
    <svg viewBox="0 0 100 100" width={size*0.82} height={size*0.82} xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 5 A 45 45 0 1 1 18 80" fill="none" stroke="#2E86DE" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 82 80 A 45 45 0 0 1 50 95" fill="none" stroke="#2E86DE" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 50 18 L 22 78 L 78 78 Z" fill="#2E86DE"/>
      <line x1="50" y1="32" x2="36" y2="62" stroke="white" strokeWidth="3.5" strokeDasharray="6,4" strokeLinecap="round"/>
      <line x1="50" y1="32" x2="64" y2="62" stroke="white" strokeWidth="3.5" strokeDasharray="6,4" strokeLinecap="round"/>
      <path d="M 50 44 L 39 68 L 61 68 Z" fill="white" opacity="0.15"/>
    </svg>
  </div>
);

const IgIcon=({size=24})=>(
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
<defs><radialGradient id="ig-g" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs>
<rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-g)"/>
<circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.8"/>
<circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
</svg>
);
const FbIcon=({size=24})=>(
<svg width={size} height={size} viewBox="0 0 24 24">
<rect width="24" height="24" rx="5" fill="#1877F2"/>
<path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="white"/>
</svg>
);
const WaIcon=({size=24})=>(
<svg width={size} height={size} viewBox="0 0 24 24">
<rect width="24" height="24" rx="5" fill="#25D366"/>
<path d="M12 4a8 8 0 0 0-6.93 11.97L4 20l4.17-1.03A8 8 0 1 0 12 4zm4.12 10.88c-.18.5-1.04.96-1.44 1.02-.37.05-.84.07-1.35-.08-.51-.16-.84-.32-1.22-.45a9.55 9.55 0 0 1-3.3-2.92c-.46-.6-.77-1.3-.77-2.02 0-.7.27-1.3.74-1.77.15-.16.32-.2.43-.2h.32c.1 0 .24-.04.37.28.14.33.47 1.14.51 1.22.04.08.07.18.01.29-.06.1-.09.17-.18.26-.09.08-.18.17-.08.33.1.16.46.76.99 1.23.68.6 1.25.79 1.43.87.18.09.28.07.38-.04.1-.1.44-.51.56-.69.12-.17.24-.14.4-.08.16.06 1.02.48 1.2.57.17.08.29.13.33.2.04.07.04.42-.14.92z" fill="white"/>
</svg>
);
const GgIcon=({size=24})=>(
<svg width={size} height={size} viewBox="0 0 24 24">
<rect width="24" height="24" rx="5" fill="white"/>
<path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" fill="#4285F4"/>
</svg>
);

export default function SteerAssist(){
const[page,setPage]=useState(“home”);
const[isInst,setIsInst]=useState(false);
const[bookings,setBookings]=useLS(“sa_bk”,S_BOOKINGS);
const[students,setStudents]=useLS(“sa_st”,S_STUDENTS);
const[blocked,setBlocked]=useLS(“sa_bl”,S_BLOCKED);
const[tests,setTests]=useLS(“sa_ts”,S_TESTS);
const[phoneOpen,setPhoneOpen]=useState(false);

const pubPages=isInst
?[{id:“dashboard”,l:“Home”,n:“home”},{id:“diary”,l:“Diary”,n:“cal”},{id:“students”,l:“Students”,n:“user”},{id:“achieve”,l:“Achieve”,n:“trophy”}]
:[{id:“home”,l:“Home”,n:“home”},{id:“book”,l:“Book”,n:“cal”},{id:“mybookings”,l:“Bookings”,n:“user”},{id:“progress”,l:“Progress”,n:“bar”},{id:“reviews”,l:“Reviews”,n:“star”}];

const navExtra=isInst
?{id:”__logout”,l:“Logout”,n:“logout”}
:{id:“login”,l:“Login”,n:“lock”};

const go=p=>{ setPage(p); window.scrollTo(0,0); };
const deskNav=isInst
?[{id:“dashboard”,l:“Dashboard”},{id:“diary”,l:“Diary”},{id:“students”,l:“Students”},{id:“achieve”,l:“Achievements”}]
:[{id:“home”,l:“Home”},{id:“book”,l:“Book a Lesson”},{id:“mybookings”,l:“My Bookings”},{id:“progress”,l:“Progress”},{id:“reviews”,l:“Reviews”},{id:“contact”,l:“Contact”},{id:“faq”,l:“FAQ”}];

return(
<>
<style>{GLOBAL_CSS}</style>
<div className="sa-app">
<nav className="sa-topnav">
<button onClick={()=>go(“home”)} style={{background:“none”,border:“none”,cursor:“pointer”,display:“flex”,alignItems:“center”,gap:12}}>
<Logo size={36}/>
<div style={{textAlign:“left”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:16,fontWeight:800,color:”#fff”,lineHeight:1}}>Steer Assist</div>
<div style={{fontSize:10,color:“rgba(255,255,255,0.5)”}}>South East Melbourne</div>
</div>
</button>
<div style={{display:“flex”,alignItems:“center”,gap:4}}>
{deskNav.map(item=>(
<button key={item.id} className={`sa-topnav-btn${page===item.id?" active":""}`} onClick={()=>go(item.id)}>{item.l}</button>
))}
{isInst
?<button className=“sa-topnav-btn” onClick={()=>{setIsInst(false);go(“home”);}}>Logout</button>
:<button className=“sa-topnav-cta” onClick={()=>go(“login”)}>Instructor Login</button>
}
</div>
</nav>
<div className="sa-page">
{page===“home”     && <HomePage     go={go} tests={tests} />}
{page===“book”     && <BookPage     bookings={bookings} setBookings={setBookings} students={students} setStudents={setStudents} blocked={blocked} go={go}/>}
{page===“mybookings”&&<MyBookings   bookings={bookings} setBookings={setBookings} />}
{page===“progress” && <ProgressPage students={students} bookings={bookings} />}
{page===“reviews”  && <ReviewsPage  tests={tests} />}
{page===“contact”  && <ContactPage  go={go}/>}
{page===“faq”      && <FaqPage      />}
{page===“login”    && <LoginPage    setIsInst={setIsInst} go={go}/>}
{page===“dashboard”&& isInst && <Dashboard   bookings={bookings} students={students} go={go}/>}
{page===“diary”    && isInst && <DiaryPage   bookings={bookings} setBookings={setBookings} blocked={blocked} setBlocked={setBlocked}/>}
{page===“students” && isInst && <StudentsPage students={students} setStudents={setStudents} bookings={bookings}/>}
{page===“achieve”  && isInst && <AchievePage  tests={tests} setTests={setTests}/>}
</div>

```
    <div style={{position:"fixed",bottom:86,right:16,zIndex:300,display:"flex",alignItems:"center",gap:8}}>
      {phoneOpen&&(
        <a href={`tel:${PHONE}`} className="phone-pill" style={{display:"flex",alignItems:"center",gap:8,background:C.green,borderRadius:24,padding:"10px 16px",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(16,185,129,0.4)",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>
          <I n="phone" s={16} c="#fff"/> {PHONE_DISPLAY}
        </a>
      )}
      <button onClick={()=>setPhoneOpen(p=>!p)} style={{width:48,height:48,borderRadius:"50%",background:phoneOpen?"#EF4444":C.green,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(16,185,129,0.5)",transition:"all 0.2s",flexShrink:0}}>
        <I n={phoneOpen?"x":"phone"} s={20} c="#fff"/>
      </button>
    </div>

    
    <nav className="sa-nav">
      {pubPages.map(item=>(
        <button key={item.id} className={`sa-nav-btn${page===item.id?" active":""}`} onClick={()=>go(item.id)}>
          <I n={item.n} s={19} c={page===item.id?"#fff":"rgba(255,255,255,0.4)"} fw={page===item.id?2.5:2}/>
          <span>{item.l}</span>
        </button>
      ))}
      <button className={`sa-nav-btn${page===navExtra.id||page==="dashboard"||page==="diary"||page==="students"||page==="achieve"?" active":""}`}
        onClick={()=>{ if(isInst){setIsInst(false);go("home");}else go("login"); }}>
        <I n={navExtra.n} s={19} c={(page===navExtra.id||isInst)?"#fff":"rgba(255,255,255,0.4)"} fw={2}/>
        <span>{navExtra.l}</span>
      </button>
    </nav>
  </div>
</>
```

);
}

function HomePage({go,tests}){
const[mounted,setMounted]=useState(false);
useEffect(()=>{setTimeout(()=>setMounted(true),50);},[]);

return(
<div>

```
  <div style={{background:`linear-gradient(160deg, ${C.navy} 0%, ${C.blue} 55%, ${C.brand} 100%)`,padding:"28px 20px 0",position:"relative",overflow:"hidden",minHeight:360}}>

    
    <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
    <div style={{position:"absolute",top:60,right:30,width:100,height:100,borderRadius:"50%",background:"rgba(245,166,35,0.12)"}}/>

    
    <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:30,padding:"6px 14px",marginBottom:16,backdropFilter:"blur(8px)"}}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" fill="#fff"/></svg>
      <span style={{color:"#fff",fontSize:12,fontWeight:700}}>5.0</span>
      <span style={{color:"#F5A623",fontSize:13,letterSpacing:1}}>*****</span>
      <span style={{color:"rgba(255,255,255,0.6)",fontSize:11}}>Google Reviews</span>
    </div>

    
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Logo size={46}/>
        <div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",lineHeight:1}}>Steer Assist</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>South East Melbourne</div>
        </div>
      </div>
      <div className="shimmer-badge" style={{padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:800,color:C.navy,letterSpacing:0.5}}>EX-VICROADS *</div>
    </div>

    
    <div className={`fade-up${mounted?" fade-up-1":""}`}>
      <div style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Trusted . Experienced . Local</div>
      <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:30,fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:10,letterSpacing:"-0.5px"}}>
        Your Road to<br/>
        <span style={{color:C.gold}}>Confidence</span>
      </h1>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,marginBottom:6,maxWidth:320}}>
        Ex-VicRoads Licence Testing Officer with <strong style={{color:"#fff"}}>2,500+ tests experience.</strong> We know exactly what examiners look for.
      </p>
    </div>

    
    <div className={`fade-up${mounted?" fade-up-2":""}`} style={{display:"flex",gap:8,marginTop:20,paddingBottom:28,flexWrap:"wrap"}}>
      <button onClick={()=>go("book")} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 18px",background:`linear-gradient(135deg,${C.gold},${C.amber})`,border:"none",borderRadius:12,fontWeight:800,fontSize:13,color:C.navy,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(245,166,35,0.4)",flexShrink:0}}>
        <I n="cal" s={15} c={C.navy}/> Book Lesson
      </button>
      <button onClick={()=>go("reviews")} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(8px)",flexShrink:0}}>
        <I n="star" s={14} c={C.gold}/> Reviews
      </button>
      <button onClick={()=>go("contact")} style={{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(8px)",flexShrink:0}}>
        <I n="mail" s={14} c="#fff"/> Get Quote
      </button>
    </div>
  </div>

  
  <div style={{background:"#2A2A2A",height:64,overflow:"hidden",position:"relative",flexShrink:0}}>
    
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"#F5A623"}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"#F5A623"}}/>
    
    <div className="hero-road" style={{position:"absolute",top:"50%",transform:"translateY(-50%)",display:"flex",width:"200%",gap:0,alignItems:"center"}}>
      {Array.from({length:32}).map((_,i)=>(
        <div key={i} style={{flexShrink:0,width:52,height:6,background:"#fff",borderRadius:3,marginRight:36,opacity:0.9}}/>
      ))}
    </div>
    
    <div style={{position:"absolute",top:14,left:0,right:0,height:2,background:"rgba(255,255,255,0.06)"}}/>
    <div style={{position:"absolute",bottom:14,left:0,right:0,height:2,background:"rgba(255,255,255,0.06)"}}/>
  </div>

  
  <div className="sa-stats-grid" style={{background:"#fff",display:"grid",gridTemplateColumns:"repeat(4,1fr)",margin:"16px 16px 0",borderRadius:16,boxShadow:"0 4px 24px rgba(10,22,40,0.1)",overflow:"hidden"}}>
    {[["2,500+","Students"],["100%","Pass Rate"],["5+","Yrs Exp"],["2,500+","Tests"]].map(([n,l],i)=>(
      <div key={l} style={{textAlign:"center",padding:"14px 4px",borderRight:i<3?"1px solid #F1F5F9":"none"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,color:C.brand}}>{n}</div>
        <div style={{fontSize:10,color:C.muted,fontWeight:600,marginTop:2}}>{l}</div>
      </div>
    ))}
  </div>

  
  <div style={{padding:"24px 20px 0"}}>
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:C.navy,marginBottom:4}}>How It Works</div>
    <div style={{fontSize:13,color:C.slate,marginBottom:16}}>Three simple steps to your licence</div>
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      {[["01","Book Online","Pick your preferred day & time. Single lesson or multi-book at once.","cal",C.brand],
        ["02","Learn & Track","Structured lessons with topic-by-topic progress tracking.","bar",C.gold],
        ["03","Pass Your Test","We'll mark you exam-ready and guide you through the test process.","award",C.green]
      ].map(([num,title,desc,icon,col],i)=>(
        <div key={num} style={{display:"flex",gap:14,paddingBottom:20,position:"relative"}}>
          {i<2&&<div style={{position:"absolute",left:20,top:44,width:2,height:"calc(100% - 16px)",background:`linear-gradient(180deg,${col}40,transparent)`}}/>}
          <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${col}20,${col}10)`,border:`2px solid ${col}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <I n={icon} s={18} c={col}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:800,color:col,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{num}</div>
            <div style={{fontWeight:800,fontSize:15,color:C.navy,marginBottom:3}}>{title}</div>
            <div style={{fontSize:12,color:C.slate,lineHeight:1.55}}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  
  <div style={{padding:"0 0 0 20px"}}>
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:C.navy,marginBottom:4}}>Lesson Packages</div>
    <div style={{fontSize:13,color:C.slate,marginBottom:16}}>Contact us for pricing -- we tailor to your needs</div>
  </div>
  <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",paddingLeft:20,paddingRight:20,paddingBottom:16,paddingTop:16}}>
    <div className="sa-pkg-track" style={{display:"flex",gap:14,width:"max-content"}}>
      {PACKAGES.map(p=>(
        <div key={p.id} className="pkg-card sa-pkg-card" style={{width:220,background:"#fff",borderRadius:20,padding:"24px 20px 20px",boxShadow:p.popular?"0 8px 32px rgba(46,134,222,0.2)":"0 4px 16px rgba(0,0,0,0.06)",border:p.popular?`2px solid ${C.brand}`:"2px solid transparent",position:"relative",flexShrink:0,marginTop:p.popular?16:0}}>
          {p.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${C.brand},${C.navy})`,color:"#fff",fontSize:10,fontWeight:800,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap",letterSpacing:0.5}}>MOST POPULAR</div>}
          <div style={{fontSize:32,marginBottom:8}}>{p.icon}</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,color:C.navy,marginBottom:4}}>{p.name}</div>
          <div style={{fontSize:12,color:C.slate,lineHeight:1.5,marginBottom:14}}>{p.desc}</div>
          <div style={{marginBottom:16}}>
            {p.features.map(f=>(
              <div key={f} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:`${C.green}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <I n="check" s={10} c={C.green} fw={3}/>
                </div>
                <span style={{fontSize:12,color:C.slate}}>{f}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>go("contact")} style={{width:"100%",padding:"10px",background:p.popular?`linear-gradient(135deg,${C.brand},${C.navy})`:"#F4F7FB",border:"none",borderRadius:10,fontWeight:700,fontSize:13,color:p.popular?"#fff":C.brand,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
            Enquire Now ->
          </button>
        </div>
      ))}
    </div>
  </div>

  
  <div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,margin:"0 16px",borderRadius:20,padding:20,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
    <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
      <div style={{width:52,height:52,borderRadius:14,background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <I n="shield" s={24} c={C.gold}/>
      </div>
      <div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.3}}>Ex-VicRoads Licence Testing Officer</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>2,500+ Tests Conducted</div>
      </div>
    </div>
    <p style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65,marginBottom:14}}>
      Our instructor brings first-hand experience from inside the test centre -- giving you an unmatched advantage. We know exactly what examiners look for on test day.
    </p>
    <div style={{fontWeight:700,fontSize:12,color:C.gold,marginBottom:10}}>📍 Service Areas</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {SUBURBS.map(s=>(
        <span key={s} style={{background:"rgba(255,255,255,0.1)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600}}>{s}</span>
      ))}
    </div>
  </div>

  
  <div style={{padding:"20px 20px 0"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:C.navy}}>Student Reviews</div>
      <button onClick={()=>go("reviews")} style={{fontSize:13,color:C.brand,fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>See all -></button>
    </div>
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginLeft:-20,paddingLeft:20,paddingRight:20,paddingBottom:4}}>
      <div style={{display:"flex",gap:12,width:"max-content"}}>
        {tests.slice(0,3).map(t=>(
          <div key={t.id} style={{width:240,background:"#fff",borderRadius:16,padding:16,boxShadow:"0 4px 16px rgba(0,0,0,0.06)",flexShrink:0}}>
            <Stars n={t.stars} s={13}/>
            <p style={{fontSize:13,color:C.slate,fontStyle:"italic",lineHeight:1.55,margin:"8px 0 12px"}}>"{t.text}"</p>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.brand},${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,flexShrink:0}}>{t.name[0]}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{t.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  
  <div style={{margin:"20px 16px 0",background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:C.navy,marginBottom:4}}>Got Questions?</div>
        <div style={{fontSize:13,color:C.slate}}>Browse our frequently asked questions</div>
      </div>
      <button onClick={()=>go("faq")} style={{padding:"10px 16px",background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:"none",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
        View FAQs
      </button>
    </div>
  </div>

  
  <div style={{margin:"16px 16px 24px",display:"flex",gap:10}}>
    <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 6px",background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",borderRadius:14,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <IgIcon size={17}/> Instagram
    </a>
    <a href={FB_URL} target="_blank" rel="noopener noreferrer" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 6px",background:"#1877F2",borderRadius:14,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <FbIcon size={17}/> Facebook
    </a>
    <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 6px",background:"#25D366",borderRadius:14,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <WaIcon size={17}/> WhatsApp
    </a>
  </div>
</div>
```

);
}

function BookPage({bookings,setBookings,students,setStudents,blocked,go}){
const[step,setStep]=useState(1);
const[form,setForm]=useState({name:””,email:””,phone:””,notes:””});
const[slots,setSlots]=useState([]);
const[weekAnchor,setWeekAnchor]=useState(now());
const[duration,setDuration]=useState(60);
const[errors,setErrors]=useState({});
const touchX=useRef(null);
const wk=weekOf(weekAnchor);

// Swipe gesture
const onTouchStart=e=>touchX.current=e.touches[0].clientX;
const onTouchEnd=e=>{
if(touchX.current===null)return;
const diff=touchX.current-e.changedTouches[0].clientX;
if(Math.abs(diff)>50){ diff>0?setWeekAnchor(addD(wk[0],7)):setWeekAnchor(addD(wk[0],-7)); }
touchX.current=null;
};

const isBlocked=(d,h)=>blocked.some(b=>b.date===d&&(b.allDay||b.hour===h));
const isBooked=(d,h)=>bookings.some(b=>b.date===d&&b.hour===h&&b.status!==“cancelled”);
const isSel=(d,h)=>slots.some(s=>s.date===d&&s.hour===h);
const isPast=(d,h)=>new Date(`${d}T${String(h).padStart(2,"0")}:00:00`)<new Date();
const toggle=(d,h)=>{
if(isBooked(d,h)||isBlocked(d,h)||isPast(d,h))return;
setSlots(p=>p.some(s=>s.date===d&&s.hour===h)?p.filter(s=>!(s.date===d&&s.hour===h)):[…p,{date:d,hour:h,duration}]);
};

function validate(){
const e={};
if(!form.name.trim())e.name=“Required”;
if(!/\S+@\S+.\S+/.test(form.email))e.email=“Valid email required”;
if(!form.phone.trim())e.phone=“Required”;
setErrors(e);return Object.keys(e).length===0;
}
function confirm(){
let st=students.find(s=>s.email.toLowerCase()===form.email.toLowerCase());
if(!st){
st={id:uid(),name:form.name,email:form.email,phone:form.phone,enrolled:now(),pkg:0,progress:Object.fromEntries(TOPICS.map(t=>[t,false])),examReady:false,examDate:null,examResult:null};
setStudents([…students,st]);
}
setBookings([…bookings,…slots.map(s=>({id:uid(),sid:st.id,sName:form.name,sEmail:form.email,sPhone:form.phone,date:s.date,hour:s.hour,dur:s.duration,status:“confirmed”,notes:form.notes}))]);
setStep(4);
}

const DAY=[“Mon”,“Tue”,“Wed”,“Thu”,“Fri”,“Sat”,“Sun”];

const Hdr=()=>(
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 16px”,color:”#fff”}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:16}}>
<Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Book a Lesson</div><div style={{fontSize:11,opacity:0.65}}>Step {Math.min(step,3)} of 3</div></div>
</div>
<div style={{display:“flex”,gap:6}}>
{[“Details”,“Pick Slots”,“Confirm”].map((s,i)=>(
<div key={s} style={{flex:1}}>
<div style={{height:3,borderRadius:4,background:step>i+1?”#fff”:step===i+1?“rgba(255,255,255,0.8)”:“rgba(255,255,255,0.25)”,transition:“all 0.3s”}}/>
<div style={{fontSize:10,color:step>=i+1?“rgba(255,255,255,0.8)”:“rgba(255,255,255,0.35)”,marginTop:4,fontWeight:600}}>{s}</div>
</div>
))}
</div>
</div>
);

if(step===1)return(
<div><Hdr/>
<div style={{padding:16}}>
<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 20px rgba(0,0,0,0.06)”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,color:C.navy,marginBottom:4}}>Your Details</div>
<div style={{fontSize:13,color:C.slate,marginBottom:20}}>We’ll use these to confirm your booking</div>
{[[“name”,“Full Name”,“text”,“John Smith”],[“email”,“Email”,“email”,“john@example.com”],[“phone”,“Phone”,“tel”,“0412 345 678”]].map(([k,label,type,ph])=>(
<div key={k} style={{marginBottom:14}}>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>{label}</label>
<input className=“sa-input” style={{width:“100%”,padding:“12px 14px”,border:`2px solid ${errors[k]?C.red:C.line}`,borderRadius:12,fontSize:15,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,boxSizing:“border-box”,background:errors[k]?”#FFF5F5”:”#F8FAFC”}}
type={type} placeholder={ph} value={form[k]} onChange={e=>setForm({…form,[k]:e.target.value})}/>
{errors[k]&&<div style={{fontSize:12,color:C.red,marginTop:3}}>{errors[k]}</div>}
</div>
))}
<div style={{marginBottom:16}}>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:8,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>Lesson Duration</label>
<div style={{display:“flex”,gap:8}}>
{DURATIONS.map(d=>(
<button key={d} onClick={()=>setDuration(d)} style={{flex:1,padding:“11px 4px”,borderRadius:12,border:`2px solid ${duration===d?C.brand:C.line}`,background:duration===d?”#EFF6FF”:”#F8FAFC”,fontWeight:700,fontSize:14,cursor:“pointer”,color:duration===d?C.brand:C.slate,transition:“all 0.2s”}}>
{d===60?“1 hr”:d===90?“1.5 hr”:“2 hr”}
</button>
))}
</div>
</div>
<div style={{marginBottom:20}}>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>Notes (optional)</label>
<textarea className=“sa-input” style={{width:“100%”,padding:“12px 14px”,border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,boxSizing:“border-box”,minHeight:72,resize:“vertical”,background:”#F8FAFC”}}
placeholder=“Any special requirements…” value={form.notes} onChange={e=>setForm({…form,notes:e.target.value})}/>
</div>
<button onClick={()=>{if(validate())setStep(2);}} style={{width:“100%”,padding:“14px”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:“none”,borderRadius:12,fontWeight:800,fontSize:15,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>
Next: Pick Your Slots ->
</button>
</div>
</div>
</div>
);

if(step===2)return(
<div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
<Hdr/>

```
  <div style={{background:"#fff",padding:"12px 16px 0",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:C.navy}}>
        {new Date(wk[0]+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short"})} - {new Date(wk[6]+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})}
      </div>
      <div style={{display:"flex",gap:6}}>
        <button onClick={()=>setWeekAnchor(addD(wk[0],-7))} style={{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><I n="chevL" s={15} c={C.slate}/></button>
        <button onClick={()=>setWeekAnchor(addD(wk[0],7))} style={{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><I n="chevR" s={15} c={C.slate}/></button>
      </div>
    </div>
    <div className="swipe-hint" style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted,marginBottom:10}}>
      <I n="chevL" s={12} c={C.muted}/> Swipe left/right to change week
    </div>
    <div style={{display:"flex",gap:10,paddingBottom:10}}>
      {[["#EFF6FF",C.brand,"Available"],["#D1FAE5",C.green,"Selected"],["#FEF3C7","#B45309","Booked"],["#F1F5F9",C.muted,"Past"]].map(([bg,bd,l])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}>
          <div style={{width:12,height:12,borderRadius:3,background:bg,border:`1.5px solid ${bd}`}}/>
          <span style={{color:C.muted,fontWeight:600}}>{l}</span>
        </div>
      ))}
    </div>
  </div>

  
  <div style={{overflowX:"auto",overflowY:"auto",maxHeight:"calc(100vh - 340px)",WebkitOverflowScrolling:"touch",background:"#fff",borderBottom:`1px solid ${C.line}`}}>
    <table style={{borderCollapse:"collapse",tableLayout:"fixed",width:"100%",minWidth:wk.length*54+60}}>
      <thead>
        <tr>
          <th style={{width:60,minWidth:60,position:"sticky",left:0,top:0,zIndex:10,background:"#fff",borderBottom:`2px solid ${C.line}`,borderRight:`1px solid ${C.line}`,padding:"6px 4px"}}/>
          {wk.map((d,di)=>{
            const isT=d===now(),isPast=d<now();
            return(
              <th key={d} style={{width:54,position:"sticky",top:0,zIndex:5,background:isT?"#EFF6FF":"#fff",borderBottom:`2px solid ${isT?C.brand:C.line}`,borderLeft:`1px solid ${C.line}`,padding:"6px 2px",textAlign:"center"}}>
                <div style={{fontSize:10,fontWeight:700,color:isT?C.brand:C.muted}}>{DAY[di]}</div>
                <div style={{width:28,height:28,borderRadius:"50%",background:isT?C.brand:"transparent",color:isT?"#fff":isPast?C.muted:C.navy,display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto 1px",fontSize:14,fontWeight:800}}>{new Date(d+"T12:00:00").getDate()}</div>
                <div style={{fontSize:9,color:C.muted}}>{new Date(d+"T12:00:00").toLocaleDateString("en-AU",{month:"short"})}</div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {HOURS.map(h=>(
          <tr key={h}>
            <td style={{position:"sticky",left:0,zIndex:4,background:"#fff",borderRight:`1px solid ${C.line}`,borderBottom:`1px solid #F8FAFC`,padding:"0 6px 0 8px",width:60,minWidth:60,whiteSpace:"nowrap"}}>
              <span style={{fontSize:10,color:C.muted,fontWeight:700}}>{fmtT(h)}</span>
            </td>
            {wk.map(d=>{
              const bkd=isBooked(d,h),blk=isBlocked(d,h),sel=isSel(d,h),past=isPast(d,h);
              const unavail=bkd||blk||past;
              return(
                <td key={d} style={{padding:2,borderBottom:`1px solid #F8FAFC`,borderLeft:`1px solid #F8FAFC`,height:46,width:54}}>
                  <button className="slot-btn" onClick={()=>toggle(d,h)} disabled={unavail}
                    style={{width:"100%",height:"100%",minHeight:42,borderRadius:8,border:sel?`2px solid ${C.green}`:"none",cursor:unavail?"default":"pointer",
                      background:sel?"#D1FAE5":bkd?"#FEF3C7":blk?"#FEE2E2":past?"#F8FAFC":"#EFF6FF",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>
                    {sel?<span style={{color:C.green,fontWeight:900,fontSize:16}}>v</span>
                      :bkd?<span style={{fontSize:10,color:"#B45309"}}>o</span>
                      :blk?<span style={{fontSize:12}}>🔒</span>
                      :past?null
                      :<span style={{color:"#93C5FD",fontSize:18}}>+</span>}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  
  <div style={{padding:"12px 16px",background:C.offwhite}}>
    {slots.length>0?(
      <div style={{background:"#fff",borderRadius:16,padding:16,boxShadow:`0 4px 20px rgba(46,134,222,0.15)`,border:`2px solid ${C.brand}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:800,fontSize:15,color:C.navy}}>🗓 {slots.length} lesson{slots.length>1?"s":""} selected</span>
          <span style={{fontSize:12,color:C.slate}}>{duration} min each</span>
        </div>
        <div style={{maxHeight:100,overflowY:"auto",marginBottom:12}}>
          {[...slots].sort((a,b)=>a.date.localeCompare(b.date)||a.hour-b.hour).map(s=>(
            <div key={`${s.date}-${s.hour}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${C.line}`}}>
              <span style={{fontSize:13,color:C.navy,fontWeight:600}}>{new Date(s.date+"T12:00:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})} . {fmtT(s.hour)}</span>
              <button onClick={()=>setSlots(p=>p.filter(x=>!(x.date===s.date&&x.hour===s.hour)))} style={{background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 7px",cursor:"pointer"}}><I n="x" s={12} c={C.red}/></button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:"10px",background:"#F4F7FB",border:`2px solid ${C.line}`,borderRadius:10,fontWeight:700,fontSize:13,color:C.brand,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setStep(1)}><- Back</button>
          <button style={{flex:2,padding:"10px",background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:"none",borderRadius:10,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setStep(3)}>Review Booking -></button>
        </div>
      </div>
    ):(
      <button style={{width:"100%",padding:"12px",background:"#F4F7FB",border:`2px solid ${C.line}`,borderRadius:12,fontWeight:700,fontSize:13,color:C.brand,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>setStep(1)}><- Back to Details</button>
    )}
  </div>
</div>
```

);

if(step===3)return(
<div><Hdr/>
<div style={{padding:16}}>
<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 20px rgba(0,0,0,0.06)”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,color:C.navy,marginBottom:16}}>Confirm Booking</div>
<div style={{background:C.offwhite,borderRadius:14,padding:16,marginBottom:14}}>
<div style={{display:“flex”,gap:10,marginBottom:12}}>
<div style={{width:40,height:40,borderRadius:10,background:`${C.brand}20`,display:“flex”,alignItems:“center”,justifyContent:“center”}}><I n="user" s={18} c={C.brand}/></div>
<div><div style={{fontWeight:700,fontSize:15,color:C.navy}}>{form.name}</div><div style={{fontSize:12,color:C.slate}}>{form.email}</div></div>
</div>
<div style={{height:1,background:C.line,marginBottom:12}}/>
<div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:8}}>{slots.length} Lesson{slots.length>1?“s”:””}</div>
{[…slots].sort((a,b)=>a.date.localeCompare(b.date)).map(s=>(
<div key={`${s.date}-${s.hour}`} style={{fontSize:13,color:C.slate,paddingBottom:4}}>📅 {fmtD(s.date)} . {fmtT(s.hour)} ({s.duration} min)</div>
))}
</div>
<div style={{background:”#FEF3C7”,borderRadius:12,padding:12,marginBottom:16,fontSize:13,color:”#92400E”}}>
📧 Confirmation will be sent to {form.email}
</div>
<div style={{display:“flex”,gap:10}}>
<button style={{flex:1,padding:“12px”,background:”#F4F7FB”,border:`2px solid ${C.line}`,borderRadius:12,fontWeight:700,fontSize:13,color:C.brand,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}} onClick={()=>setStep(2)}><- Back</button>
<button style={{flex:2,padding:“12px”,background:`linear-gradient(135deg,${C.green},#059669)`,border:“none”,borderRadius:12,fontWeight:800,fontSize:15,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}} onClick={confirm}>
v Confirm All
</button>
</div>
</div>
</div>
</div>
);

return(
<div><Hdr/>
<div style={{padding:16}}>
<div style={{background:”#fff”,borderRadius:20,padding:32,textAlign:“center”,boxShadow:“0 4px 20px rgba(0,0,0,0.06)”}}>
<div style={{fontSize:64,marginBottom:16}}>🎉</div>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:22,fontWeight:800,color:C.navy,marginBottom:8}}>You’re Booked!</div>
<div style={{fontSize:14,color:C.slate,marginBottom:24,lineHeight:1.6}}>{slots.length} lesson{slots.length>1?“s”:””} confirmed for {form.name}.<br/>Check your email for confirmation.</div>
<div style={{display:“flex”,flexDirection:“column”,gap:10}}>
<button style={{padding:“13px”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:“none”,borderRadius:12,fontWeight:800,fontSize:15,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}} onClick={()=>{setStep(1);setForm({name:””,email:””,phone:””,notes:””});setSlots([]);}}>Book More Lessons</button>
<button style={{padding:“13px”,background:”#F4F7FB”,border:`2px solid ${C.line}`,borderRadius:12,fontWeight:700,fontSize:13,color:C.brand,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}} onClick={()=>go(“mybookings”)}>View My Bookings</button>
</div>
</div>
</div>
</div>
);
}

function MyBookings({bookings,setBookings}){
const[email,setEmail]=useState(””);const[searched,setSearched]=useState(false);
const mine=searched?bookings.filter(b=>b.sEmail.toLowerCase()===email.toLowerCase()).sort((a,b)=>a.date.localeCompare(b.date)||a.hour-b.hour):[];
const upcoming=mine.filter(b=>b.date>=now()&&b.status!==“cancelled”);
const past=mine.filter(b=>b.date<now()||b.status===“cancelled”);
const cancel=id=>setBookings(bookings.map(b=>b.id===id?{…b,status:“cancelled”}:b));
const BCard=({b})=>(
<div style={{background:”#fff”,borderRadius:16,padding:16,margin:“0 0 10px”,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”,borderLeft:`4px solid ${b.status==="exam"?C.gold:b.status==="cancelled"?C.line:b.date<now()?C.line:C.green}`}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div>{b.status===“exam”&&<div style={{fontSize:18,marginBottom:2}}>🏆 EXAM DAY!</div>}<div style={{fontWeight:800,fontSize:15,color:C.navy}}>{fmtD(b.date)}</div><div style={{fontSize:13,color:C.slate,marginTop:2}}>{fmtT(b.hour)} . {b.dur} min</div></div>
<span style={{fontSize:11,fontWeight:700,padding:“3px 10px”,borderRadius:20,background:b.status===“cancelled”?”#F1F5F9”:b.status===“exam”?”#FEF3C7”:b.date<now()?”#F1F5F9”:”#D1FAE5”,color:b.status===“cancelled”?C.muted:b.status===“exam”?”#92400E”:b.date<now()?C.muted:”#065F46”}}>
{b.status===“cancelled”?“Cancelled”:b.status===“exam”?“Test Day”:b.date<now()?“Completed”:“Confirmed”}
</span>
</div>
{b.date>=now()&&b.status!==“cancelled”&&<button onClick={()=>cancel(b.id)} style={{marginTop:10,padding:“7px 14px”,background:”#FEE2E2”,border:“none”,borderRadius:8,fontSize:12,fontWeight:700,color:C.red,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Cancel</button>}
</div>
);
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 24px”,color:”#fff”}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:16}}><Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>My Bookings</div><div style={{fontSize:11,opacity:0.65}}>View & manage your lessons</div></div></div>
<div style={{display:“flex”,gap:8}}>
<input className=“sa-input” style={{flex:1,padding:“11px 14px”,border:“1.5px solid rgba(255,255,255,0.3)”,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,background:“rgba(255,255,255,0.12)”,color:”#fff”}} placeholder=“Enter your email…” value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key===“Enter”&&setSearched(true)}/>
<button onClick={()=>setSearched(true)} style={{padding:“11px 16px”,background:C.gold,border:“none”,borderRadius:12,fontWeight:800,color:C.navy,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Find</button>
</div>
</div>
<div style={{padding:16}}>
{searched&&mine.length===0&&<div style={{background:”#fff”,borderRadius:16,padding:32,textAlign:“center”,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}><div style={{fontSize:40,marginBottom:8}}>📭</div><div style={{fontWeight:700,color:C.navy}}>No bookings found</div><div style={{fontSize:13,color:C.slate,marginTop:4}}>No lessons found for this email.</div></div>}
{upcoming.length>0&&<><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:15,fontWeight:800,color:C.navy,marginBottom:10}}>Upcoming ({upcoming.length})</div>{upcoming.map(b=><BCard key={b.id} b={b}/>)}</>}
{past.length>0&&<><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:15,fontWeight:800,color:C.muted,margin:“16px 0 10px”}}>Past & Cancelled</div>{past.map(b=><BCard key={b.id} b={b}/>)}</>}
</div>
</div>
);
}

function ProgressPage({students,bookings}){
const[email,setEmail]=useState(””);const[searched,setSearched]=useState(false);
const st=searched?students.find(s=>s.email.toLowerCase()===email.toLowerCase()):null;
const myB=st?bookings.filter(b=>b.sEmail.toLowerCase()===st.email.toLowerCase()):[];
const done=Object.values(st?.progress||{}).filter(Boolean).length;
const pct=st?Math.round(done/TOPICS.length*100):0;
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 24px”,color:”#fff”}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:16}}><Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>My Progress</div><div style={{fontSize:11,opacity:0.65}}>Track your learning journey</div></div></div>
<div style={{display:“flex”,gap:8}}>
<input className=“sa-input” style={{flex:1,padding:“11px 14px”,border:“1.5px solid rgba(255,255,255,0.3)”,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,background:“rgba(255,255,255,0.12)”,color:”#fff”}} placeholder=“Enter your email…” value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key===“Enter”&&setSearched(true)}/>
<button onClick={()=>setSearched(true)} style={{padding:“11px 16px”,background:C.gold,border:“none”,borderRadius:12,fontWeight:800,color:C.navy,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Find</button>
</div>
</div>
<div style={{padding:16}}>
{searched&&!st&&<div style={{background:”#fff”,borderRadius:16,padding:32,textAlign:“center”}}><div style={{fontSize:40}}>🔍</div><div style={{fontWeight:700,color:C.navy,marginTop:8}}>Not found</div></div>}
{st&&<>
{st.examReady&&!st.examResult&&<div style={{background:`linear-gradient(135deg,${C.gold},${C.amber})`,borderRadius:20,padding:20,marginBottom:12,color:C.navy}}><div style={{fontSize:28,marginBottom:4}}>🏆</div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>You’re Exam Ready!</div><div style={{fontSize:13,marginTop:4,opacity:0.8}}>Your instructor has approved you for the test.{st.examDate&&` Test: ${fmtD(st.examDate)}`}</div></div>}
{st.examResult===“pass”&&<div style={{background:`linear-gradient(135deg,${C.green},#059669)`,borderRadius:20,padding:20,marginBottom:12,color:”#fff”}}><div style={{fontSize:28}}>🎉</div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,marginTop:4}}>Test Passed!</div><div style={{fontSize:13,marginTop:4,opacity:0.9}}>Congratulations on passing your driving test!</div></div>}
<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”,marginBottom:12}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,color:C.navy,marginBottom:2}}>Hi {st.name.split(” “)[0]}! 👋</div>
<div style={{fontSize:12,color:C.muted,marginBottom:16}}>Since {fmtD(st.enrolled)}</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:16}}>
{[[“Lessons Taken”,myB.filter(b=>b.date<now()&&b.status!==“cancelled”).length,C.brand,“car”],[“Topics Done”,`${done}/${TOPICS.length}`,C.green,“check”]].map(([l,v,col,ic])=>(
<div key={l} style={{background:C.offwhite,borderRadius:12,padding:14,textAlign:“center”}}>
<I n={ic} s={20} c={col}/><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:22,fontWeight:800,color:col,marginTop:4}}>{v}</div><div style={{fontSize:11,color:C.muted}}>{l}</div>
</div>
))}
</div>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:C.navy}}>Overall Progress</span><span style={{fontSize:13,fontWeight:800,color:C.brand}}>{pct}%</span></div>
<div style={{background:C.line,borderRadius:20,height:12,overflow:“hidden”}}><div style={{height:“100%”,width:`${pct}%`,background:`linear-gradient(90deg,${C.brand},${C.sky})`,borderRadius:20,transition:“width 1s ease”}}/></div>
</div>
<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:16,fontWeight:800,color:C.navy,marginBottom:12}}>Learning Topics</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:6}}>
{TOPICS.map(t=>(
<span key={t} style={{display:“inline-flex”,alignItems:“center”,gap:4,padding:“5px 12px”,borderRadius:20,fontSize:12,fontWeight:600,background:st.progress[t]?”#D1FAE5”:”#F1F5F9”,color:st.progress[t]?”#065F46”:C.slate}}>
{st.progress[t]?“v “:“o “}{t}
</span>
))}
</div>
</div>
</>}
</div>
</div>
);
}

function ReviewsPage({tests}){
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 28px”,color:”#fff”}}>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:16}}><Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Reviews</div><div style={{fontSize:11,opacity:0.65}}>What our students say</div></div></div>
<div style={{display:“flex”,alignItems:“center”,gap:16}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:52,fontWeight:800,color:”#fff”,lineHeight:1}}>5.0</div>
<div><div style={{color:C.gold,fontSize:24,letterSpacing:2}}>*****</div><div style={{fontSize:12,opacity:0.7,marginTop:4}}>{tests.length+G_REVIEWS.length} total reviews</div></div>
</div>
</div>
<div style={{padding:16}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,color:C.navy,marginBottom:12}}>Student Testimonials</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:20}}>
{tests.map(t=>(
<div key={t.id} style={{background:”#fff”,borderRadius:16,padding:14,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,marginBottom:8}}>
<div style={{width:32,height:32,borderRadius:“50%”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#fff”,fontWeight:800,fontSize:13,flexShrink:0}}>{t.name[0]}</div>
<div style={{fontSize:12,fontWeight:700,color:C.navy,lineHeight:1.3}}>{t.name}</div>
</div>
<Stars n={t.stars} s={12}/>
<p style={{fontSize:12,color:C.slate,lineHeight:1.5,fontStyle:“italic”,marginTop:6}}>”{t.text.length>80?t.text.slice(0,80)+”…”:t.text}”</p>
<div style={{fontSize:10,color:C.muted,marginTop:6}}>{t.date}</div>
</div>
))}
</div>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,color:C.navy,marginBottom:12}}>Google Reviews</div>
{G_REVIEWS.map((r,i)=>(
<div key={i} style={{background:”#fff”,borderRadius:16,padding:16,marginBottom:10,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div style={{display:“flex”,gap:10}}><div style={{width:38,height:38,borderRadius:“50%”,background:”#E8F0FE”,display:“flex”,alignItems:“center”,justifyContent:“center”,fontWeight:800,color:”#4285F4”,fontSize:15}}>{r.name[0]}</div><div><div style={{fontWeight:700,fontSize:14,color:C.navy}}>{r.name}</div><Stars n={r.stars} s={13}/></div></div>
<div style={{fontSize:11,color:C.muted}}>{r.ago}</div>
</div>
<p style={{fontSize:13,color:C.slate,marginTop:8,fontStyle:“italic”}}>”{r.text}”</p>
</div>
))}
<div style={{display:“flex”,gap:8,marginTop:4,flexWrap:“wrap”}}>
<a href={IG_URL} target=”_blank” rel=“noopener noreferrer” style={{flex:1,minWidth:90,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:6,padding:“10px 6px”,background:“linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)”,borderRadius:12,color:”#fff”,textDecoration:“none”,fontWeight:700,fontSize:11,fontFamily:”‘Plus Jakarta Sans’,sans-serif”}}><IgIcon size={15}/> Instagram</a>
<a href={FB_URL} target=”_blank” rel=“noopener noreferrer” style={{flex:1,minWidth:90,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:6,padding:“10px 6px”,background:”#1877F2”,borderRadius:12,color:”#fff”,textDecoration:“none”,fontWeight:700,fontSize:11,fontFamily:”‘Plus Jakarta Sans’,sans-serif”}}><FbIcon size={15}/> Facebook</a>
<a href={WA_URL} target=”_blank” rel=“noopener noreferrer” style={{flex:1,minWidth:90,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:6,padding:“10px 6px”,background:”#25D366”,borderRadius:12,color:”#fff”,textDecoration:“none”,fontWeight:700,fontSize:11,fontFamily:”‘Plus Jakarta Sans’,sans-serif”}}><WaIcon size={15}/> WhatsApp</a>
<a href={GR_URL} target=”_blank” rel=“noopener noreferrer” style={{flex:1,minWidth:90,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:6,padding:“10px 6px”,background:”#fff”,border:“1.5px solid #E2E8F0”,borderRadius:12,color:”#4285F4”,textDecoration:“none”,fontWeight:700,fontSize:11,fontFamily:”‘Plus Jakarta Sans’,sans-serif”}}><GgIcon size={15}/> Google</a>
</div>
</div>
</div>
);
}

function ContactPage({go}){
const[form,setForm]=useState({name:””,email:””,phone:””,type:“Pricing Enquiry”,message:””});
const[status,setStatus]=useState(“idle”);// idle|sending|sent|error
const TYPES=[“Pricing Enquiry”,“Lesson Availability”,“Test Preparation Advice”,“Gift a Lesson”,“Intensive Course”,“General Question”];

async function send(){
if(!form.name||!form.email||!form.message){setStatus(“error”);return;}
setStatus(“sending”);
try{
await fetch(`https://api.emailjs.com/api/v1.0/email/send`,{
method:“POST”,headers:{“Content-Type”:“application/json”},
body:JSON.stringify({service_id:EJS_SERVICE,template_id:EJS_TEMPLATE,user_id:EJS_KEY,
template_params:{from_name:form.name,from_email:form.email,phone:form.phone,enquiry_type:form.type,message:form.message,to_email:EMAIL}})
});
setStatus(“sent”);
}catch{setStatus(“error”);}
}

if(status===“sent”)return(
<div style={{minHeight:“100vh”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,padding:24,background:C.offwhite}}>
<div style={{background:”#fff”,borderRadius:24,padding:36,textAlign:“center”,boxShadow:“0 8px 40px rgba(0,0,0,0.1)”,maxWidth:380}}>
<div style={{fontSize:64,marginBottom:16}}></div>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:22,fontWeight:800,color:C.navy,marginBottom:8}}>Message Sent!</div>
<div style={{fontSize:14,color:C.slate,lineHeight:1.6,marginBottom:24}}>Thanks {form.name}! We’ll get back to you shortly on <strong>{form.email}</strong>.</div>
<button onClick={()=>go(“home”)} style={{padding:“13px 28px”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:“none”,borderRadius:12,fontWeight:800,fontSize:15,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Back to Home</button>
</div>
</div>
);

return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 32px”,color:”#fff”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,bottom:-40,right:-40,width:160,height:160,borderRadius:“50%”,background:“rgba(255,255,255,0.05)”}}/>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:20}}><Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Get in Touch</div><div style={{fontSize:11,opacity:0.65}}>We’ll get back to you ASAP</div></div></div>
<div style={{display:“flex”,gap:10}}>
<a href={`tel:${PHONE}`} style={{flex:1,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:8,padding:“11px”,background:“rgba(255,255,255,0.12)”,border:“1.5px solid rgba(255,255,255,0.3)”,borderRadius:12,color:”#fff”,textDecoration:“none”,fontWeight:700,fontSize:13,fontFamily:”‘DM Sans’,sans-serif”}}><I n="phone" s={15} c="#fff"/> Call Us</a>
<a href={`mailto:${EMAIL}`} style={{flex:1,display:“flex”,alignItems:“center”,justifyContent:“center”,gap:8,padding:“11px”,background:“rgba(255,255,255,0.12)”,border:“1.5px solid rgba(255,255,255,0.3)”,borderRadius:12,color:”#fff”,textDecoration:“none”,fontWeight:700,fontSize:13,fontFamily:”‘DM Sans’,sans-serif”}}><I n="mail" s={15} c="#fff"/> Email Us</a>
</div>
</div>

```
  <div style={{padding:16}}>
    
    <div style={{background:"#FEF3C7",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"#92400E",lineHeight:1.55}}>
       <strong>Setup required:</strong> To receive form messages, create a free account at <strong>emailjs.com</strong> and replace the SERVICE_ID, TEMPLATE_ID and PUBLIC_KEY at the top of this file. <a href="https://emailjs.com" style={{color:C.brand,fontWeight:700}}>Get started -></a>
    </div>

    <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:C.navy,marginBottom:4}}>Send us a Message</div>
      <div style={{fontSize:13,color:C.slate,marginBottom:20}}>We'll respond within 24 hours</div>
      {[["name","Your Name","text","John Smith"],["email","Email Address","email","john@example.com"],["phone","Phone Number","tel","0412 345 678"]].map(([k,label,type,ph])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5}}>{label}</label>
          <input className="sa-input" style={{width:"100%",padding:"12px 14px",border:`2px solid ${C.line}`,borderRadius:12,fontSize:15,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",background:"#F8FAFC"}} type={type} placeholder={ph} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
        </div>
      ))}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5}}>Enquiry Type</label>
        <select className="sa-input" style={{width:"100%",padding:"12px 14px",border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",background:"#F8FAFC",color:C.navy,cursor:"pointer",appearance:"auto"}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          {TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={{marginBottom:20}}>
        <label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5}}>Your Message</label>
        <textarea className="sa-input" style={{width:"100%",padding:"12px 14px",border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",minHeight:100,resize:"vertical",background:"#F8FAFC"}} placeholder="Tell us what you need..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
      </div>
      {status==="error"&&<div style={{background:"#FEE2E2",borderRadius:10,padding:10,marginBottom:12,fontSize:13,color:C.red}}>! Please fill in your name, email and message, then try again.</div>}
      <button onClick={send} disabled={status==="sending"} style={{width:"100%",padding:"14px",background:status==="sending"?"#94A3B8":`linear-gradient(135deg,${C.brand},${C.navy})`,border:"none",borderRadius:12,fontWeight:800,fontSize:15,color:"#fff",cursor:status==="sending"?"default":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
        {status==="sending"?"Sending...":"Send Message 📨"}
      </button>
    </div>

    
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
      {[[`tel:${PHONE}`,"phone",C.green,"Call Us",PHONE_DISPLAY],[`mailto:${EMAIL}`,"mail",C.brand,"Email Us","info@steerassist"]].map(([href,ic,col,label,val])=>(
        <a key={ic} href={href} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:16,background:"#fff",borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",textDecoration:"none",gap:6}}>
          <div style={{width:40,height:40,borderRadius:12,background:`${col}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><I n={ic} s={20} c={col}/></div>
          <div style={{fontSize:11,color:C.muted,fontWeight:600}}>{label}</div>
          <div style={{fontSize:12,fontWeight:800,color:C.navy,textAlign:"center"}}>{val}</div>
        </a>
      ))}
    </div>
  </div>
</div>
```

);
}

function FaqPage(){
const[open,setOpen]=useState(null);
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 32px”,color:”#fff”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,bottom:-60,right:-30,width:180,height:180,borderRadius:“50%”,background:“rgba(255,255,255,0.05)”}}/>
<div style={{display:“flex”,alignItems:“center”,gap:12,marginBottom:16}}><Logo size={38}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>FAQs</div><div style={{fontSize:11,opacity:0.65}}>Frequently asked questions</div></div></div>
<div style={{display:“flex”,alignItems:“center”,gap:10,background:“rgba(255,255,255,0.1)”,borderRadius:14,padding:“10px 16px”}}>
<I n="question" s={20} c={C.gold}/>
<div style={{fontSize:13,color:“rgba(255,255,255,0.85)”,lineHeight:1.5}}>Can’t find your answer? <a href={`tel:${PHONE}`} style={{color:C.gold,fontWeight:700,textDecoration:“none”}}>Call us free</a> – we’re happy to help.</div>
</div>
</div>
<div style={{padding:16}}>
{FAQS.map((f,i)=>(
<div key={i} style={{background:”#fff”,borderRadius:16,marginBottom:10,overflow:“hidden”,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”,border:open===i?`2px solid ${C.brand}`:“2px solid transparent”,transition:“border 0.2s”}}>
<button onClick={()=>setOpen(open===i?null:i)} style={{width:“100%”,padding:“16px 18px”,background:“none”,border:“none”,cursor:“pointer”,display:“flex”,justifyContent:“space-between”,alignItems:“center”,gap:12,fontFamily:”‘DM Sans’,sans-serif”}}>
<span style={{fontWeight:700,fontSize:14,color:C.navy,textAlign:“left”,lineHeight:1.4}}>{f.q}</span>
<div style={{width:28,height:28,borderRadius:“50%”,background:open===i?`${C.brand}15`:”#F4F7FB”,display:“flex”,alignItems:“center”,justifyContent:“center”,flexShrink:0,transition:“all 0.2s”}}>
<I n={open===i?“chevU”:“chevD”} s={14} c={open===i?C.brand:C.muted}/>
</div>
</button>
<div className=“faq-answer” style={{maxHeight:open===i?400:0,opacity:open===i?1:0}}>
<div style={{padding:“0 18px 16px”,fontSize:13,color:C.slate,lineHeight:1.7,borderTop:`1px solid ${C.line}`}}>
<div style={{height:12}}/>
{f.a}
</div>
</div>
</div>
))}
<div style={{background:`linear-gradient(135deg,${C.navy},${C.blue})`,borderRadius:20,padding:20,marginTop:8,textAlign:“center”}}>
<div style={{fontSize:24,marginBottom:8}}>📞</div>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:17,fontWeight:800,color:”#fff”,marginBottom:4}}>Still have questions?</div>
<div style={{fontSize:13,color:“rgba(255,255,255,0.7)”,marginBottom:16}}>Call us for free advice – no obligation</div>
<a href={`tel:${PHONE}`} style={{display:“inline-flex”,alignItems:“center”,gap:8,padding:“12px 28px”,background:`linear-gradient(135deg,${C.gold},${C.amber})`,borderRadius:14,textDecoration:“none”,fontWeight:800,fontSize:15,color:C.navy,fontFamily:”‘DM Sans’,sans-serif”}}>
<I n="phone" s={16} c={C.navy}/> {PHONE_DISPLAY}
</a>
</div>
</div>
</div>
);
}

function LoginPage({setIsInst,go}){
const[pw,setPw]=useState(””);const[err,setErr]=useState(””);
function login(){pw===PASS?(setIsInst(true),go(“dashboard”)):setErr(“Incorrect password.”);}
return(
<div style={{minHeight:“100vh”,background:C.offwhite,display:“flex”,flexDirection:“column”}}>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“40px 20px 60px”,textAlign:“center”,color:”#fff”}}>
<Logo size={60}/><br/>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:22,fontWeight:800,marginTop:12}}>Instructor Portal</div>
<div style={{fontSize:13,opacity:0.65,marginTop:4}}>Enter your password to continue</div>
</div>
<div style={{flex:1,padding:“0 16px”,marginTop:-24}}>
<div style={{background:”#fff”,borderRadius:24,padding:24,boxShadow:“0 8px 40px rgba(0,0,0,0.1)”}}>
<div style={{width:56,height:56,borderRadius:16,background:`${C.brand}15`,display:“flex”,alignItems:“center”,justifyContent:“center”,margin:“0 auto 20px”}}><I n="lock" s={26} c={C.brand}/></div>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:6,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>Password</label>
<input className=“sa-input” style={{width:“100%”,padding:“13px 16px”,border:`2px solid ${err?C.red:C.line}`,borderRadius:12,fontSize:15,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,boxSizing:“border-box”,marginBottom:6}} type=“password” placeholder=“Enter password” value={pw} onChange={e=>{setPw(e.target.value);setErr(””);}} onKeyDown={e=>e.key===“Enter”&&login()}/>
{err&&<div style={{fontSize:13,color:C.red,marginBottom:8}}>{err}</div>}
<div style={{fontSize:12,color:C.muted,marginBottom:20}}>Demo: steerassist2024</div>
<button onClick={login} style={{width:“100%”,padding:“14px”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,border:“none”,borderRadius:12,fontWeight:800,fontSize:15,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Login to Portal</button>
</div>
</div>
</div>
);
}

function Dashboard({bookings,students,go}){
const todayB=bookings.filter(b=>b.date===now()&&b.status!==“cancelled”).sort((a,b)=>a.hour-b.hour);
const upcoming=bookings.filter(b=>b.date>now()&&b.status!==“cancelled”).length;
const exams=bookings.filter(b=>b.status===“exam”&&b.date>=now());
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 24px”,color:”#fff”}}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,marginBottom:4}}>
<div style={{display:“flex”,alignItems:“center”,gap:12}}><Logo size={42}/><div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Dashboard</div><div style={{fontSize:11,opacity:0.65}}>{new Date().toLocaleDateString(“en-AU”,{weekday:“long”,day:“numeric”,month:“long”})}</div></div></div>
</div>
</div>
<div style={{padding:“16px 16px 0”}}>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:12,marginBottom:16}}>
{[[“Today”,todayB.length,C.brand,“cal”],[“Upcoming”,upcoming,C.sky,“bell”],[“Students”,students.length,C.green,“user”],[“Exams Soon”,exams.length,C.gold,“trophy”]].map(([l,v,col,ic])=>(
<div key={l} style={{background:”#fff”,borderRadius:16,padding:16,boxShadow:“0 2px 12px rgba(0,0,0,0.06)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:28,fontWeight:800,color:col}}>{v}</div>
<div style={{width:36,height:36,borderRadius:10,background:`${col}15`,display:“flex”,alignItems:“center”,justifyContent:“center”}}><I n={ic} s={18} c={col}/></div>
</div>
<div style={{fontSize:12,color:C.muted,marginTop:4,fontWeight:600}}>{l}</div>
</div>
))}
</div>
{exams.length>0&&<div style={{background:`linear-gradient(135deg,${C.gold},${C.amber})`,borderRadius:16,padding:16,marginBottom:16,color:C.navy}}>
<div style={{fontWeight:800,fontSize:14,marginBottom:8}}>🏆 Upcoming Test Days</div>
{exams.map(b=><div key={b.id} style={{fontSize:13,marginBottom:3}}>{b.sName} – {fmtD(b.date)} at {fmtT(b.hour)}</div>)}
</div>}
<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”,marginBottom:16}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:16,fontWeight:800,color:C.navy,marginBottom:12}}>Today’s Schedule</div>
{todayB.length===0?<div style={{color:C.muted,fontSize:14,textAlign:“center”,padding:“16px 0”}}>No lessons today 🎉</div>
:todayB.map(b=>(
<div key={b.id} style={{display:“flex”,gap:12,alignItems:“center”,padding:“10px 0”,borderBottom:`1px solid ${C.line}`}}>
<div style={{width:48,textAlign:“center”,background:b.status===“exam”?”#FEF3C7”:”#EFF6FF”,borderRadius:10,padding:“6px 4px”}}>
<div style={{fontWeight:800,fontSize:15,color:b.status===“exam”?C.gold:C.brand}}>{fmtT(b.hour).split(” “)[0]}</div>
<div style={{fontSize:9,color:C.muted}}>{fmtT(b.hour).split(” “)[1]}</div>
</div>
<div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:C.navy}}>{b.status===“exam”?“🏆 “:””}{b.sName}</div><div style={{fontSize:12,color:C.muted}}>{b.dur} min . {b.sPhone}</div></div>
</div>
))}
</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:16}}>
{[[“diary”,“Diary”,“cal”],[“students”,“Students”,“user”],[“achieve”,“Achievements”,“trophy”],[“diary”,“Export CSV”,“download”]].map(([p,label,ic])=>(
<button key={label} onClick={()=>go(p)} style={{display:“flex”,alignItems:“center”,gap:8,padding:14,background:”#fff”,border:`2px solid ${C.line}`,borderRadius:14,cursor:“pointer”,fontWeight:700,fontSize:13,color:C.navy,fontFamily:”‘DM Sans’,sans-serif”}}>
<I n={ic} s={18} c={C.brand}/> {label}
</button>
))}
</div>
</div>
</div>
);
}

function DiaryPage({bookings,setBookings,blocked,setBlocked}){
const[weekAnchor,setWeekAnchor]=useState(now());
const[selDate,setSelDate]=useState(now());
const[modal,setModal]=useState(null);
const[reason,setReason]=useState(””);
const[exportMsg,setExportMsg]=useState(””);
const wk=weekOf(weekAnchor);
const DAY=[“Mon”,“Tue”,“Wed”,“Thu”,“Fri”,“Sat”,“Sun”];
const dayB=d=>bookings.filter(b=>b.date===d&&b.status!==“cancelled”).sort((a,b)=>a.hour-b.hour);
const isBlocked=(d,h=null)=>blocked.some(b=>b.date===d&&(b.allDay||(h!==null&&b.hour===h)));
const rmBlock=id=>setBlocked(blocked.filter(b=>b.id!==id));
const saveBlock=(allDay,h=null)=>{setBlocked([…blocked,{id:uid(),date:modal.date,hour:allDay?null:h,allDay,reason}]);setModal(null);setReason(””);};
const upStatus=(id,status)=>setBookings(bookings.map(b=>b.id===id?{…b,status}:b));
function exportCSV(){
const rows=[[“Date”,“Time”,“Student”,“Email”,“Phone”,“Duration”,“Status”,“Notes”]];
bookings.forEach(b=>rows.push([b.date,fmtT(b.hour),b.sName,b.sEmail,b.sPhone,b.dur+” min”,b.status,b.notes]));
const blob=new Blob([rows.map(r=>r.map(c=>`"${c}"`).join(”,”)).join(”\n”)],{type:“text/csv”});
const a=document.createElement(“a”);a.href=URL.createObjectURL(blob);a.download=“steer-assist-bookings.csv”;a.click();
setExportMsg(” Done!”);setTimeout(()=>setExportMsg(””),2000);
}
const db=dayB(selDate);const dayBl=blocked.filter(b=>b.date===selDate);
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 16px”,color:”#fff”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Diary</div>
<button onClick={exportCSV} style={{display:“flex”,alignItems:“center”,gap:6,padding:“8px 14px”,background:`linear-gradient(135deg,${C.gold},${C.amber})`,border:“none”,borderRadius:10,fontWeight:700,fontSize:12,color:C.navy,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>
<I n="download" s={13} c={C.navy}/>{exportMsg||“Export CSV”}
</button>
</div>
</div>

```
  <div style={{background:"#fff",padding:"12px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <button onClick={()=>setWeekAnchor(addD(wk[0],-7))} style={{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><I n="chevL" s={15} c={C.slate}/></button>
      <span style={{fontWeight:700,fontSize:13,color:C.navy}}>{new Date(wk[0]+"T12:00:00").toLocaleDateString("en-AU",{month:"short",day:"numeric"})} - {new Date(wk[6]+"T12:00:00").toLocaleDateString("en-AU",{month:"short",day:"numeric"})}</span>
      <button onClick={()=>setWeekAnchor(addD(wk[0],7))} style={{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}><I n="chevR" s={15} c={C.slate}/></button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
      {wk.map((d,i)=>{const isT=d===now(),isSel=d===selDate,cnt=dayB(d).length,blk=isBlocked(d);
        return(<button key={d} onClick={()=>setSelDate(d)} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 2px",borderRadius:10,border:"none",cursor:"pointer",background:isSel?C.brand:blk?"#FEE2E2":isT?"#EFF6FF":"#F8FAFC"}}>
          <span style={{fontSize:10,fontWeight:700,color:isSel?"#fff":C.muted}}>{DAY[i]}</span>
          <span style={{fontSize:16,fontWeight:800,color:isSel?"#fff":isT?C.brand:C.navy}}>{new Date(d+"T12:00:00").getDate()}</span>
          {cnt>0&&<span style={{width:6,height:6,borderRadius:"50%",background:isSel?"#fff":C.green,marginTop:1}}/>}
        </button>);
      })}
    </div>
  </div>
  
  <div style={{padding:16}}>
    <div style={{background:"#fff",borderRadius:20,padding:20,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:C.navy}}>{fmtD(selDate)}</div><div style={{fontSize:12,color:C.muted}}>{db.length} lesson{db.length!==1?"s":""}</div></div>
        <button onClick={()=>setModal({date:selDate,allDay:true})} style={{padding:"7px 12px",background:"#FEE2E2",border:"none",borderRadius:10,fontWeight:700,fontSize:12,color:C.red,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🔒 Block Day</button>
      </div>
      {dayBl.length>0&&<div style={{background:"#FEE2E2",borderRadius:10,padding:10,marginBottom:12}}>
        {dayBl.map(bl=><div key={bl.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}><span style={{fontSize:13,color:C.red,fontWeight:600}}>🔒 {bl.allDay?"Full day":fmtT(bl.hour)} -- {bl.reason||"Blocked"}</span><button onClick={()=>rmBlock(bl.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.red,fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>Remove</button></div>)}
      </div>}
      {HOURS.map(h=>{
        const bk=db.find(b=>b.hour===h),bl=blocked.find(b=>b.date===selDate&&!b.allDay&&b.hour===h);
        return(<div key={h} style={{display:"flex",alignItems:"center",gap:10,minHeight:50,borderBottom:`1px solid #F8FAFC`}}>
          <div style={{width:56,fontSize:11,color:C.muted,fontWeight:700,flexShrink:0}}>{fmtT(h)}</div>
          {bk?(<div style={{flex:1,background:bk.status==="exam"?"#FEF3C7":"#EFF6FF",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:14,color:C.navy}}>{bk.status==="exam"?"🏆 ":""}{bk.sName}</div><div style={{fontSize:11,color:C.muted}}>{bk.dur} min</div></div>
            <div style={{display:"flex",gap:6}}>
              {bk.status!=="exam"&&<button onClick={()=>upStatus(bk.id,"exam")} style={{background:C.gold,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:C.navy,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Set Exam</button>}
              <button onClick={()=>setBookings(bookings.map(b=>b.id===bk.id?{...b,status:"cancelled"}:b))} style={{background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer"}}><I n="x" s={12} c={C.red}/></button>
            </div>
          </div>)
          :bl?(<div style={{flex:1,background:"#FEE2E2",borderRadius:10,padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:C.red}}>🔒 {bl.reason||"Blocked"}</span><button onClick={()=>rmBlock(bl.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.red,fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>Remove</button></div>)
          :(<button onClick={()=>setModal({date:selDate,hour:h})} style={{flex:1,background:"none",border:`1.5px dashed ${C.line}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",color:C.muted,fontSize:12,textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}>+ Block this slot</button>)}
        </div>);
      })}
    </div>
  </div>
  {modal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setModal(null)}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:480}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,color:C.navy,marginBottom:4}}>{modal.allDay?"Block Full Day":`Block ${fmtT(modal.hour)}`}</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:16}}>{fmtD(modal.date)}</div>
      <label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5}}>Reason (optional)</label>
      <input className="sa-input" style={{width:"100%",padding:"12px 14px",border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:16}} placeholder="e.g. Holiday, Lunch, Personal..." value={reason} onChange={e=>setReason(e.target.value)}/>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setModal(null)} style={{flex:1,padding:"12px",background:"#F4F7FB",border:`2px solid ${C.line}`,borderRadius:12,fontWeight:700,fontSize:13,color:C.brand,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
        <button onClick={()=>saveBlock(!!modal.allDay,modal.hour)} style={{flex:2,padding:"12px",background:C.red,border:"none",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🔒 Block</button>
      </div>
    </div>
  </div>}
</div>
```

);
}

function StudentsPage({students,setStudents,bookings}){
const[search,setSearch]=useState(””);const[filter,setFilter]=useState(“all”);const[sel,setSel]=useState(null);const[editP,setEditP]=useState(false);
const getLessons=id=>bookings.filter(b=>b.sid===id&&b.status!==“cancelled”).length;
const getPct=st=>Math.round(Object.values(st.progress).filter(Boolean).length/TOPICS.length*100);
const upProg=(id,t,v)=>{setStudents(students.map(s=>s.id===id?{…s,progress:{…s.progress,[t]:v}}:s));if(sel?.id===id)setSel(p=>({…p,progress:{…p.progress,[t]:v}}));};
const setExamR=(id,v)=>{setStudents(students.map(s=>s.id===id?{…s,examReady:v}:s));if(sel?.id===id)setSel(p=>({…p,examReady:v}));};
const setExamRes=(id,r)=>{setStudents(students.map(s=>s.id===id?{…s,examResult:r}:s));if(sel?.id===id)setSel(p=>({…p,examResult:r}));};
const filtered=students.filter(s=>{
const ms=s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase());
if(filter===“exam-ready”)return ms&&s.examReady&&!s.examResult;
if(filter===“passed”)return ms&&s.examResult===“pass”;
if(filter===“in-progress”)return ms&&!s.examReady;
return ms;
});

if(sel){
const s=students.find(x=>x.id===sel.id)||sel;
const pct=getPct(s);
const upcoming=bookings.filter(b=>b.sid===s.id&&b.date>=now()&&b.status!==“cancelled”).sort((a,b)=>a.date.localeCompare(b.date));
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“16px 20px 24px”,color:”#fff”}}>
<button onClick={()=>{setSel(null);setEditP(false);}} style={{background:“rgba(255,255,255,0.15)”,border:“none”,borderRadius:8,padding:“6px 12px”,color:”#fff”,cursor:“pointer”,fontWeight:700,fontSize:13,marginBottom:12,fontFamily:”‘DM Sans’,sans-serif”}}><- Back</button>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:20,fontWeight:800}}>{s.name}</div>
<div style={{fontSize:12,opacity:0.7,marginTop:2}}>{s.email} . {s.phone}</div>
</div>
<div style={{padding:16}}>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr 1fr”,gap:10,marginBottom:14}}>
{[[“Lessons”,getLessons(s.id),C.brand],[“Done”,bookings.filter(b=>b.sid===s.id&&b.date<now()&&b.status!==“cancelled”).length,C.green],[“Progress”,pct+”%”,C.gold]].map(([l,v,col])=>(
<div key={l} style={{background:”#fff”,borderRadius:14,padding:14,textAlign:“center”,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:20,fontWeight:800,color:col}}>{v}</div><div style={{fontSize:11,color:C.muted}}>{l}</div></div>
))}
</div>
<div style={{background:”#fff”,borderRadius:18,padding:18,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”,marginBottom:12}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:15,fontWeight:800,color:C.navy,marginBottom:12}}>Exam Status</div>
{s.examResult?(<div style={{background:s.examResult===“pass”?”#D1FAE5”:”#FEE2E2”,borderRadius:12,padding:12}}><div style={{fontWeight:800,color:s.examResult===“pass”?”#065F46”:C.red,fontSize:16}}>{s.examResult===“pass”?“🎉 PASSED!”:“X Did not pass”}</div></div>)
:!s.examReady?(<button onClick={()=>setExamR(s.id,true)} style={{padding:“10px 18px”,background:`linear-gradient(135deg,${C.gold},${C.amber})`,border:“none”,borderRadius:10,fontWeight:700,fontSize:13,color:C.navy,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>v Mark Exam Ready</button>)
:(<div style={{display:“flex”,gap:8,flexWrap:“wrap”}}>
<span style={{background:”#FEF3C7”,borderRadius:20,padding:“5px 14px”,fontSize:13,fontWeight:800,color:”#92400E”}}>🏆 Exam Ready</span>
<button onClick={()=>setExamRes(s.id,“pass”)} style={{padding:“8px 14px”,background:C.green,border:“none”,borderRadius:10,fontWeight:700,fontSize:13,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>v Passed</button>
<button onClick={()=>setExamRes(s.id,“fail”)} style={{padding:“8px 14px”,background:C.red,border:“none”,borderRadius:10,fontWeight:700,fontSize:13,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>x Failed</button>
<button onClick={()=>setExamR(s.id,false)} style={{padding:“8px 14px”,background:”#F4F7FB”,border:`1.5px solid ${C.line}`,borderRadius:10,fontWeight:700,fontSize:12,color:C.slate,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>Remove</button>
</div>)}
</div>
<div style={{background:”#fff”,borderRadius:18,padding:18,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”,marginBottom:12}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:10}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:15,fontWeight:800,color:C.navy}}>Topics ({Object.values(s.progress).filter(Boolean).length}/{TOPICS.length})</div>
<button onClick={()=>setEditP(!editP)} style={{padding:“6px 12px”,background:editP?”#D1FAE5”:”#F4F7FB”,border:“none”,borderRadius:8,fontWeight:700,fontSize:12,color:editP?C.green:C.brand,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>{editP?“Done v”:“Edit”}</button>
</div>
<div style={{background:C.line,borderRadius:20,height:10,marginBottom:14,overflow:“hidden”}}><div style={{height:“100%”,width:`${pct}%`,background:`linear-gradient(90deg,${C.brand},${C.sky})`,borderRadius:20}}/></div>
{TOPICS.map(t=>(
<div key={t} style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”,padding:“7px 0”,borderBottom:`1px solid #F8FAFC`}}>
<span style={{fontSize:13,color:s.progress[t]?”#065F46”:C.slate,fontWeight:s.progress[t]?700:400}}>{s.progress[t]?“v “:“o “}{t}</span>
{editP&&<button onClick={()=>upProg(s.id,t,!s.progress[t])} style={{background:s.progress[t]?”#D1FAE5”:”#EFF6FF”,border:“none”,borderRadius:8,padding:“4px 10px”,cursor:“pointer”,fontSize:12,fontWeight:700,color:s.progress[t]?C.green:C.brand,fontFamily:”‘DM Sans’,sans-serif”}}>{s.progress[t]?“v”:“Mark”}</button>}
</div>
))}
</div>
{upcoming.length>0&&<div style={{background:”#fff”,borderRadius:18,padding:18,boxShadow:“0 4px 16px rgba(0,0,0,0.06)”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:15,fontWeight:800,color:C.navy,marginBottom:10}}>Upcoming Lessons</div>
{upcoming.map(b=>(
<div key={b.id} style={{display:“flex”,gap:12,alignItems:“center”,padding:“8px 0”,borderBottom:`1px solid #F8FAFC`}}>
<div style={{background:b.status===“exam”?”#FEF3C7”:”#EFF6FF”,borderRadius:10,padding:“6px 10px”,textAlign:“center”,minWidth:48}}>
<div style={{fontWeight:800,fontSize:14,color:b.status===“exam”?C.gold:C.brand}}>{new Date(b.date+“T12:00:00”).getDate()}</div>
<div style={{fontSize:10,color:C.muted}}>{new Date(b.date+“T12:00:00”).toLocaleDateString(“en-AU”,{month:“short”})}</div>
</div>
<div><div style={{fontWeight:600,fontSize:14,color:C.navy}}>{fmtT(b.hour)} {b.status===“exam”?“🏆 EXAM”:””}</div><div style={{fontSize:12,color:C.muted}}>{b.dur} min</div></div>
</div>
))}
</div>}
</div>
</div>
);
}

return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 20px”,color:”#fff”}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800,marginBottom:2}}>Students</div>
<div style={{fontSize:11,opacity:0.65,marginBottom:14}}>{students.length} enrolled</div>
<input className=“sa-input” style={{width:“100%”,padding:“11px 14px”,border:“1.5px solid rgba(255,255,255,0.3)”,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,background:“rgba(255,255,255,0.12)”,color:”#fff”,boxSizing:“border-box”}} placeholder=“🔍 Search…” value={search} onChange={e=>setSearch(e.target.value)}/>
</div>
<div style={{display:“flex”,gap:6,padding:“12px 16px 0”,overflowX:“auto”}}>
{[[“all”,“All”],[“in-progress”,“In Progress”],[“exam-ready”,“Exam Ready”],[“passed”,“Passed”]].map(([f,l])=>(
<button key={f} onClick={()=>setFilter(f)} style={{padding:“7px 14px”,borderRadius:20,border:`2px solid ${filter===f?C.brand:C.line}`,background:filter===f?”#EFF6FF”:”#fff”,color:filter===f?C.brand:C.slate,fontWeight:700,fontSize:12,cursor:“pointer”,whiteSpace:“nowrap”,fontFamily:”‘DM Sans’,sans-serif”}}>{l}</button>
))}
</div>
<div style={{padding:“12px 16px 0”}}>
{filtered.map(s=>(
<div key={s.id} onClick={()=>setSel(s)} style={{background:”#fff”,borderRadius:16,padding:16,marginBottom:10,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”,cursor:“pointer”,display:“flex”,alignItems:“center”,gap:12}}>
<div style={{width:46,height:46,borderRadius:“50%”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#fff”,fontWeight:800,fontSize:18,flexShrink:0}}>{s.name[0]}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div style={{fontWeight:700,fontSize:15,color:C.navy}}>{s.name}</div>
<div>{s.examReady&&!s.examResult&&<span style={{fontSize:14}}>🏆</span>}{s.examResult===“pass”&&<span style={{fontSize:14}}></span>}</div>
</div>
<div style={{fontSize:12,color:C.muted,marginBottom:5}}>{getLessons(s.id)} lessons booked</div>
<div style={{display:“flex”,alignItems:“center”,gap:6}}>
<div style={{flex:1,background:C.line,borderRadius:10,height:6,overflow:“hidden”}}><div style={{height:“100%”,width:`${getPct(s)}%`,background:`linear-gradient(90deg,${C.brand},${C.sky})`,borderRadius:10}}/></div>
<span style={{fontSize:11,fontWeight:700,color:C.brand}}>{getPct(s)}%</span>
</div>
</div>
</div>
))}
</div>
</div>
);
}

function AchievePage({tests,setTests}){
const[showForm,setShowForm]=useState(false);
const[form,setForm]=useState({name:””,text:””,stars:5,date:now()});
function add(){if(!form.name||!form.text)return;setTests([{id:uid(),…form},…tests]);setForm({name:””,text:””,stars:5,date:now()});setShowForm(false);}
return(
<div>
<div style={{background:`linear-gradient(160deg,${C.navy},${C.blue})`,padding:“20px 20px 24px”,color:”#fff”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:18,fontWeight:800}}>Achievements</div><div style={{fontSize:11,opacity:0.65}}>Manage testimonials</div></div>
<button onClick={()=>setShowForm(!showForm)} style={{display:“flex”,alignItems:“center”,gap:6,padding:“8px 14px”,background:`linear-gradient(135deg,${C.gold},${C.amber})`,border:“none”,borderRadius:10,fontWeight:700,fontSize:12,color:C.navy,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}><I n="plus" s={13} c={C.navy}/>Add</button>
</div>
</div>
<div style={{padding:16}}>
{showForm&&<div style={{background:”#fff”,borderRadius:20,padding:20,boxShadow:“0 4px 20px rgba(0,0,0,0.06)”,marginBottom:14}}>
<div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:16,fontWeight:800,color:C.navy,marginBottom:14}}>New Testimonial</div>
{[[“name”,“Student Name”,“John Smith”],[“text”,“Testimonial”,“What did they say?”]].map(([k,l,ph])=>(
<div key={k} style={{marginBottom:12}}>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:5,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>{l}</label>
{k===“text”?<textarea className=“sa-input” style={{width:“100%”,padding:“11px 14px”,border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,boxSizing:“border-box”,minHeight:70,resize:“vertical”,background:”#F8FAFC”}} placeholder={ph} value={form[k]} onChange={e=>setForm({…form,[k]:e.target.value})}/>
:<input className=“sa-input” style={{width:“100%”,padding:“11px 14px”,border:`2px solid ${C.line}`,borderRadius:12,fontSize:14,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”,boxSizing:“border-box”,background:”#F8FAFC”}} placeholder={ph} value={form[k]} onChange={e=>setForm({…form,[k]:e.target.value})}/>}
</div>
))}
<div style={{marginBottom:14}}>
<label style={{fontSize:12,fontWeight:700,color:C.slate,marginBottom:8,display:“block”,textTransform:“uppercase”,letterSpacing:0.5}}>Stars</label>
<div style={{display:“flex”,gap:6}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm({…form,stars:n})} style={{fontSize:26,background:“none”,border:“none”,cursor:“pointer”,opacity:n<=form.stars?1:0.25,color:C.gold,padding:2}}>*</button>)}</div>
</div>
<button onClick={add} style={{width:“100%”,padding:“12px”,background:`linear-gradient(135deg,${C.green},#059669)`,border:“none”,borderRadius:12,fontWeight:800,fontSize:14,color:”#fff”,cursor:“pointer”,fontFamily:”‘DM Sans’,sans-serif”}}>v Save</button>
</div>}
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:14}}>
{[[tests.length,“Testimonials”,C.gold],[G_REVIEWS.length,“Google Reviews”,”#4285F4”]].map(([v,l,col])=>(
<div key={l} style={{background:”#fff”,borderRadius:14,padding:14,textAlign:“center”,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}><div style={{fontFamily:”‘Plus Jakarta Sans’,sans-serif”,fontSize:24,fontWeight:800,color:col}}>{v}</div><div style={{fontSize:12,color:C.muted}}>{l}</div></div>
))}
</div>
{tests.map(t=>(
<div key={t.id} style={{background:”#fff”,borderRadius:16,padding:16,marginBottom:10,boxShadow:“0 2px 10px rgba(0,0,0,0.05)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div style={{display:“flex”,gap:10,flex:1}}>
<div style={{width:38,height:38,borderRadius:“50%”,background:`linear-gradient(135deg,${C.brand},${C.navy})`,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#fff”,fontWeight:800,fontSize:15,flexShrink:0}}>{t.name[0]}</div>
<div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:C.navy}}>{t.name}</div><Stars n={t.stars} s={13}/><p style={{fontSize:12,color:C.slate,marginTop:5,fontStyle:“italic”,lineHeight:1.5}}>”{t.text}”</p><div style={{fontSize:10,color:C.muted,marginTop:4}}>{t.date}</div></div>
</div>
<button onClick={()=>setTests(tests.filter(x=>x.id!==t.id))} style={{background:”#FEE2E2”,border:“none”,borderRadius:8,padding:“6px 8px”,cursor:“pointer”,marginLeft:8}}><I n="trash" s={13} c={C.red}/></button>
</div>
</div>
))}
</div>
</div>
);
}
