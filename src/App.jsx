import React, { useState, useEffect, useRef } from "react";

var B = "#2E86DE", NV = "#0A1628", BL = "#1B5FA8", SK = "#5BA4E6";
var GD = "#F5A623", AM = "#E8920A", GR = "#10B981", RD = "#EF4444";
var SL = "#64748B", MT = "#94A3B8", LN = "#E2E8F0", OF = "#F4F7FB";

var PHONE = "0474917491";
var PHONED = "0474 917 491";
var EMAIL = "info@steerassist.com.au";
var PASS = "steerassist2024";
var FB = "https://www.facebook.com/people/Steer-Assist-Driving-School/100089471258940/";
var IG = "https://www.instagram.com/steerassist/";
var WA = "https://wa.me/61474917491";
var GGL = "https://share.google/zViQvMSEjYmzqNsg7";
var EJS_SVC = "service_nmde1si";
var EJS_TPL = "template_vqz1p1b";
var EJS_KEY = "-b1tWgGTupnb625uo";
var SB_URL = "https://fxyywdehocjurxkpvyqh.supabase.co";
var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4eXl3ZGVob2NqdXJ4a3B2eXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTA5MTEsImV4cCI6MjA5Mjg4NjkxMX0.O1bCR4uJHnSfGV3wqIQiMRQ-byk_tKYJu5bsED_Bv2I";

var CAR1 = "/images/steer%20assist%20car%201.png";
var CAR2 = "/images/car%202.png";
var LOGO_IMG = "/images/steer%20assist%20logo%20SQ.png";

var SUBURBS = ["Clyde","Cranbourne","Berwick","Narre Warren","Pakenham","Frankston","Dromana","Warragul","Ringwood","Heatherton","Dandenong","Endeavour Hills"];
var TOPICS = ["Cockpit checks","Moving off & stopping","Steering control","Gears & clutch","Junctions","Roundabouts","Dual carriageways","Bay parking","Parallel parking","Emergency stop","Motorway driving","Night driving","Independent driving"];
var HRS = Array.from({length:14}, function(_,i){ return i+7; });
var DNAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var PKGS = [
  {id:"p1", name:"Single Lesson", desc:"Perfect for a trial or top-up.", feats:["1 hour lesson","Pick-up & drop-off","Personalised feedback"], pop:false, aPrice:70, aOld:75, mPrice:80, mOld:85},
  {id:"p2", name:"5-Lesson Pack", desc:"Build core skills.", feats:["5 x 1 hour lessons","Pick-up & drop-off","Progress tracking","Topic checklist"], pop:false, aPrice:300, aOld:325, mPrice:310, mOld:335},
  {id:"p3", name:"10-Lesson Pack", desc:"Best value. First-time pass focus.", feats:["10 x 1 hour lessons","Pick-up & drop-off","Full progress tracking","Exam readiness check","Test prep session"], pop:true, aPrice:600, aOld:650, mPrice:610, mOld:660},
  {id:"p4", name:"Test Package", desc:"1 hour lesson + test in our car.", feats:["1 hour pre-test lesson","Use our dual-control car","Instructor on test day","Pick-up & drop-off"], pop:false, aPrice:240, aOld:250, mPrice:250, mOld:260},
];
var FAQS = [
  {q:"How many lessons do I need?", a:"It depends on your experience. Most learners need 10-20 hours with a professional instructor. We will assess you in your first lesson."},
  {q:"What areas do you cover?", a:"We service Clyde, Cranbourne, Berwick, Narre Warren, Pakenham, Frankston, Dromana, Warragul, Ringwood, Heatherton, Dandenong, Endeavour Hills and surrounding suburbs."},
  {q:"What car will I learn in?", a:"We use a modern dual-controlled vehicle so both you and the instructor have full control at all times."},
  {q:"Do you pick me up?", a:"Yes! We offer pick-up and drop-off from your home, school, or workplace within our service areas."},
  {q:"What if I need to cancel?", a:"We ask for at least 24 hours notice. Late cancellations may incur a fee."},
  {q:"How do I book my driving test?", a:"Once your instructor marks you as exam ready, you can book through VicRoads. We will guide you through the entire process."},
  {q:"Do you offer intensive courses?", a:"Yes! Contact us to discuss your timeline and we can arrange intensive lesson packages."},
  {q:"What makes Steer Assist different?", a:"Our lead instructor is an Ex-VicRoads Licence Testing Officer with 2,500+ tests experience. We know exactly what examiners look for."},
];
var GREV = [];

var ST = [
  {id:"t1",name:"Lena Park",text:"Passed first time! The VicRoads experience made all the difference.",stars:5,date:"2025-03-20"},
  {id:"t2",name:"Sheila Smith",text:"So patient and clear. I was terrified of highways but now I love driving!",stars:5,date:"2025-02-14"},
  {id:"t3",name:"Marcus T.",text:"10 lessons, first-time pass. Worth every cent.",stars:5,date:"2025-01-30"},
  {id:"t4",name:"Zara",text:"Best decision I made. Knew what the examiner was looking for.",stars:5,date:"2024-12-10"},
];

function uid() { return Math.random().toString(36).slice(2,10); }
function tod() { return new Date().toISOString().split("T")[0]; }
function addD(d,n) { var x=new Date(d+"T12:00:00"); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; }
function fmtD(d) { return new Date(d+"T12:00:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short",year:"numeric"}); }
function fmtT(h) { var s=h>=12?"PM":"AM"; var h12=h%12===0?12:h%12; return h12+":00 "+s; }
function wkOf(a) {
  var d=new Date(a+"T12:00:00"), day=d.getDay(), m=new Date(d);
  m.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:7}, function(_,i){ var x=new Date(m); x.setDate(m.getDate()+i); return x.toISOString().split("T")[0]; });
}

async function sbFetch(table) {
  try {
    var r = await fetch(SB_URL+"/rest/v1/"+table+"?select=*", {headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY}});
    return await r.json();
  } catch(e){ return null; }
}
async function sbUpsert(table, row) {
  try {
    await fetch(SB_URL+"/rest/v1/"+table, {method:"POST",headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify(row)});
  } catch(e){}
}
async function sbDelete(table, id) {
  try {
    await fetch(SB_URL+"/rest/v1/"+table+"?id=eq."+id, {method:"DELETE",headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY}});
  } catch(e){}
}
async function sbUpdate(table, id, data) {
  try {
    await fetch(SB_URL+"/rest/v1/"+table+"?id=eq."+id, {method:"PATCH",headers:{"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json"},body:JSON.stringify(data)});
  } catch(e){}
}

var CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');",
  "*{box-sizing:border-box;margin:0;padding:0;}",
  "body{background:#F4F7FB;}",
  ".app{font-family:'Plus Jakarta Sans',sans-serif;background:#F4F7FB;min-height:100vh;width:100%;position:relative;overflow-x:hidden;}",
  ".pg{padding-bottom:76px;min-height:100vh;}",
  ".nav{position:fixed;bottom:0;left:0;right:0;background:linear-gradient(180deg,#1B5FA8 0%,#0A1628 100%);display:flex;justify-content:center;z-index:200;padding-bottom:6px;box-shadow:0 -2px 20px rgba(0,0,0,0.4);}",
  ".nav-inner{display:flex;width:100%;max-width:1200px;}",
  ".nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 2px 5px;background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);font-size:9px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.2s;}",
  ".nb.on{color:#fff;}",
  ".nb:hover{color:#F5A623;}",
  "@keyframes road{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}",
  "@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}",
  "@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}",
  "@keyframes pout{from{width:0;opacity:0}to{width:160px;opacity:1}}",
  ".roadanim{animation:road 5s linear infinite;}",
  ".u1{animation:up 0.5s ease 0.1s both;}",
  ".u2{animation:up 0.5s ease 0.2s both;}",
  ".sbadge{background:linear-gradient(90deg,#F5A623 25%,#FFD07B 50%,#F5A623 75%);background-size:200% 100%;animation:shine 2s infinite;}",
  ".ppill{animation:pout 0.3s ease forwards;}",
  ".pkgc{transition:transform 0.2s;}.pkgc:hover{transform:translateY(-3px);}",
  ".faqb{overflow:hidden;transition:max-height 0.3s ease,opacity 0.3s ease;}",
  ".si:focus{border-color:#2E86DE!important;outline:none;box-shadow:0 0 0 3px rgba(46,134,222,0.15);}",
  ".slb{transition:background 0.15s;}",
  ".pkgbtn{transition:all 0.25s ease;background:linear-gradient(135deg,#F5A623,#E8920A);border:none!important;color:#0A1628!important;}",
  ".pkgbtn:hover{background:linear-gradient(135deg,#2E86DE,#0A1628)!important;color:#fff!important;}",
  ".wrap{max-width:1200px;margin:0 auto;padding:0 20px;}",
  ".d-show{display:none!important;}",
  ".d-hide{display:block;}",
  "@media(min-width:768px){",
  ".pg{padding-bottom:0;padding-top:70px;}",
  ".d-show{display:block!important;}",
  ".d-hide{display:none!important;}",
  ".wrap{padding:0 48px;}",
  ".nav{bottom:auto;top:0;box-shadow:0 2px 20px rgba(0,0,0,0.3);padding-bottom:0;}",
  ".nav-inner{padding:0 24px;}",
  ".nb{flex-direction:row;gap:8px;padding:20px 20px;font-size:13px;color:#fff;font-weight:700;}",
  ".nb:hover{color:#F5A623!important;}",
  ".nb.on{color:#fff;border-bottom:3px solid #F5A623;}",
  ".d-hero{display:grid!important;grid-template-columns:1fr 1fr;min-height:520px;align-items:center;max-width:1200px;margin:0 auto;padding:0 48px;}",
  ".d-hero-text{padding:60px 0;}",
  ".d-hero-right{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:48px 0;}",
  ".d-car-sec{display:grid!important;grid-template-columns:1fr 1fr;align-items:center;max-width:1200px;margin:0 auto;}",
  ".d-car-text{padding:48px 48px 48px 0;}",
  ".d-car-img{height:420px!important;border-radius:0;}",
  ".d-stats{max-width:1200px;margin:32px auto 0!important;padding:0 48px;}",
  ".d-how{max-width:1200px;margin:0 auto;padding:48px 48px 0;}",
  ".d-how-grid{display:grid!important;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:32px;}",
  ".d-how-card{background:#fff;border-radius:20px;padding:32px 28px;box-shadow:0 4px 24px rgba(0,0,0,0.06);}",
  ".d-pkgs{max-width:1200px;margin:0 auto;padding:48px 48px 0;}",
  ".d-pkgs-grid{grid-template-columns:repeat(4,1fr)!important;padding:0!important;}",
  ".d-pkgs-note{margin:14px 0 8px!important;}",
  ".d-about{max-width:1200px;margin:32px auto 0!important;padding:0 48px;}",
  ".d-about-inner{border-radius:20px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:320px;}",
  ".d-about-left{background:linear-gradient(135deg,#0A1628,#1B5FA8);padding:48px;}",
  ".d-about-right{background:linear-gradient(135deg,#1B5FA8,#2E86DE);padding:48px;display:flex;flex-direction:column;justify-content:center;}",
  ".d-reviews{max-width:1200px;margin:0 auto;padding:32px 48px 0;}",
  ".d-rev-grid{display:grid!important;grid-template-columns:repeat(3,1fr);gap:20px;}",
  ".d-vic{max-width:1200px;margin:32px auto 0!important;padding:0 48px;}",
  ".d-vic-inner{display:grid;grid-template-columns:1fr 1fr;border-radius:20px;overflow:hidden;min-height:300px;}",
  ".d-vic-text{background:linear-gradient(135deg,#F5A623,#E8920A);padding:48px;display:flex;flex-direction:column;justify-content:center;}",
  ".d-vic-car{background:linear-gradient(135deg,#F5A623,#E8920A);display:flex;align-items:flex-end;justify-content:center;overflow:hidden;padding-top:32px;}",
  ".d-faq{max-width:1200px;margin:32px auto 0!important;padding:0 48px;}",
  ".d-soc{max-width:1200px;margin:16px auto 32px!important;padding:0 48px;}",
  "}",
].join("");

function Ico(props) {
  var n=props.n, sz=props.sz||20, c=props.c||"currentColor", sw=props.sw||2;
  var P = {
    home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    cal:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
    user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    bar:"M18 20V10M12 20V4M6 20v-6",
    star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.92a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
    mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    check:"M20 6L9 17l-5-5",
    x:"M18 6L6 18M6 6l12 12",
    plus:"M12 5v14M5 12h14",
    cL:"M15 18l-6-6 6-6", cR:"M9 18l6-6-6-6", cD:"M6 9l6 6 6-6", cU:"M18 15l-6-6-6 6",
    award:"M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    trophy:"M6 9H2V3h4v6zm16-6h-4v6h4V3zM12 19v3m-4 0h8M8 19h8M12 15a7 7 0 0 0 7-7V3H5v5a7 7 0 0 0 7 7z",
    dl:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
    qm:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
  };
  var paths = (P[n]||"").split(" M");
  return React.createElement("svg", {width:sz,height:sz,viewBox:"0 0 24 24",fill:"none",stroke:c,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"},
    paths.map(function(p,i){ return React.createElement("path",{key:i,d:i===0?p:"M"+p}); })
  );
}

function Stars(props) {
  var n=props.n||5, size=props.size||14;
  return React.createElement("span",{style:{color:GD,fontSize:size}},"\u2605".repeat(n)+"\u2606".repeat(5-n));
}

function Logo(props) {
  var size=props.size||40;
  return React.createElement("div",{style:{width:size,height:size,borderRadius:size*0.18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}},
    React.createElement("img",{src:LOGO_IMG,alt:"Steer Assist",style:{width:"100%",height:"100%",objectFit:"contain"},onError:function(e){ e.target.style.display="none"; }})
  );
}

function IgIco(props) {
  var sz=props.sz||22;
  return React.createElement("svg",{width:sz,height:sz,viewBox:"0 0 24 24",fill:"none"},
    React.createElement("defs",null,React.createElement("radialGradient",{id:"igg",cx:"30%",cy:"107%",r:"150%"},React.createElement("stop",{offset:"0%",stopColor:"#fdf497"}),React.createElement("stop",{offset:"45%",stopColor:"#fd5949"}),React.createElement("stop",{offset:"60%",stopColor:"#d6249f"}),React.createElement("stop",{offset:"90%",stopColor:"#285AEB"}))),
    React.createElement("rect",{x:"2",y:"2",width:"20",height:"20",rx:"5",fill:"url(#igg)"}),
    React.createElement("circle",{cx:"12",cy:"12",r:"4.5",fill:"none",stroke:"white",strokeWidth:"1.8"}),
    React.createElement("circle",{cx:"17.5",cy:"6.5",r:"1.2",fill:"white"})
  );
}
function FbIco(props) {
  var sz=props.sz||22;
  return React.createElement("svg",{width:sz,height:sz,viewBox:"0 0 24 24"},React.createElement("rect",{width:"24",height:"24",rx:"5",fill:"#1877F2"}),React.createElement("path",{d:"M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z",fill:"white"}));
}
function WaIco(props) {
  var sz=props.sz||22;
  return React.createElement("svg",{width:sz,height:sz,viewBox:"0 0 24 24"},React.createElement("rect",{width:"24",height:"24",rx:"5",fill:"#25D366"}),React.createElement("path",{d:"M12 4a8 8 0 0 0-6.93 11.97L4 20l4.17-1.03A8 8 0 1 0 12 4zm4.12 10.88c-.18.5-1.04.96-1.44 1.02-.37.05-.84.07-1.35-.08-.51-.16-.84-.32-1.22-.45a9.55 9.55 0 0 1-3.3-2.92c-.46-.6-.77-1.3-.77-2.02 0-.7.27-1.3.74-1.77.15-.16.32-.2.43-.2h.32c.1 0 .24-.04.37.28.14.33.47 1.14.51 1.22.04.08.07.18.01.29-.06.1-.09.17-.18.26-.09.08-.18.17-.08.33.1.16.46.76.99 1.23.68.6 1.25.79 1.43.87.18.09.28.07.38-.04.1-.1.44-.51.56-.69.12-.17.24-.14.4-.08.16.06 1.02.48 1.2.57.17.08.29.13.33.2.04.07.04.42-.14.92z",fill:"white"}));
}
function GgIco(props) {
  var sz=props.sz||22;
  return React.createElement("svg",{width:sz,height:sz,viewBox:"0 0 24 24"},React.createElement("rect",{width:"24",height:"24",rx:"5",fill:"white"}),React.createElement("path",{d:"M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z",fill:"#4285F4"}));
}

function SBtn(props) {
  return React.createElement("a",{href:props.href,target:"_blank",rel:"noopener noreferrer",style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 6px",background:"#fff",border:"1.5px solid #E2E8F0",borderRadius:14,color:NV,textDecoration:"none",fontWeight:700,fontSize:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}},props.children);
}

function PH(props) {
  return React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 24px",color:"#fff"}},
    React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12}},
      React.createElement(Logo,{size:38}),
      React.createElement("div",null,
        React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},props.title),
        React.createElement("div",{style:{fontSize:11,opacity:0.65,marginTop:2}},props.sub)
      )
    )
  );
}

function Crd(props) {
  var s=Object.assign({background:"#fff",borderRadius:16,padding:20,margin:"12px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"},props.style||{});
  return React.createElement("div",{style:s,className:props.className||""},props.children);
}
function Lbl(props) {
  return React.createElement("label",{style:{fontSize:12,fontWeight:700,color:SL,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5}},props.children);
}
function Inp(props) {
  var s={width:"100%",padding:"12px 14px",border:"2px solid "+(props.err?RD:LN),borderRadius:12,fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none",boxSizing:"border-box",background:props.err?"#FFF5F5":"#F8FAFC"};
  if(props.multi) return React.createElement("textarea",{className:"si",style:Object.assign({},s,{minHeight:80,resize:"vertical"}),value:props.value,onChange:props.onChange,placeholder:props.placeholder});
  return React.createElement("input",{className:"si",style:s,type:props.type||"text",value:props.value,onChange:props.onChange,placeholder:props.placeholder});
}
function Btn(props) {
  var v=props.v||"primary";
  var bg=v==="primary"?"linear-gradient(135deg,"+B+","+NV+")":v==="gold"?"linear-gradient(135deg,"+GD+","+AM+")":v==="green"?"linear-gradient(135deg,"+GR+",#059669)":v==="red"?RD:"#F4F7FB";
  var col=v==="outline"?NV:v==="ghost"?B:"#fff";
  var bdr=v==="outline"?"2px solid "+LN:v==="ghost"?"2px solid "+B:"none";
  return React.createElement("button",{onClick:props.onClick,disabled:props.disabled,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:props.sm?"8px 16px":"12px 22px",background:bg,border:bdr,borderRadius:12,fontWeight:700,fontSize:props.sm?13:15,color:col,cursor:props.disabled?"not-allowed":"pointer",opacity:props.disabled?0.7:1,fontFamily:"'Plus Jakarta Sans',sans-serif",width:props.full?"100%":"auto",transition:"all 0.2s"}},props.children);
}

function ElfsightWidget() {
  useEffect(function(){
    if(!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')){
      var s=document.createElement("script");
      s.src="https://elfsightcdn.com/platform.js";
      s.async=true;
      document.head.appendChild(s);
    } else if(window.elfsight) {
      window.elfsight.reload();
    }
  },[]);
  return React.createElement("div",{className:"elfsight-app-75168746-83f5-4ddb-92c4-98e957895492","data-elfsight-app-lazy":true});
}

export default function App() {
  var r1=useState("home"); var page=r1[0]; var setPage=r1[1];
  var r2=useState(false); var isInst=r2[0]; var setIsInst=r2[1];
  var r3=useState([]); var bks=r3[0]; var setBksRaw=r3[1];
  var r4=useState([]); var stus=r4[0]; var setStusRaw=r4[1];
  var r5=useState([]); var blkd=r5[0]; var setBlkdRaw=r5[1];
  var r6=useState(ST); var tests=r6[0]; var setTestsRaw=r6[1];
  var r7=useState(false); var phoneOpen=r7[0]; var setPhoneOpen=r7[1];
  var r8=useState(true); var loading=r8[0]; var setLoading=r8[1];

  useEffect(function(){
    async function load(){
      var bkData=await sbFetch("bookings");
      var stData=await sbFetch("students");
      var blData=await sbFetch("blocked");
      var tsData=await sbFetch("testimonials");
      if(bkData&&Array.isArray(bkData)) setBksRaw(bkData.map(function(b){ return {id:b.id,sid:b.sid,sName:b.s_name,sEmail:b.s_email,sPhone:b.s_phone,date:b.date,hour:b.hour,dur:b.dur,status:b.status,notes:b.notes||""}; }));
      if(stData&&Array.isArray(stData)) setStusRaw(stData.map(function(s){ return {id:s.id,name:s.name,email:s.email,phone:s.phone,enrolled:s.enrolled,progress:s.progress||{},examReady:s.exam_ready,examDate:s.exam_date,examResult:s.exam_result}; }));
      if(blData&&Array.isArray(blData)) setBlkdRaw(blData.map(function(b){ return {id:b.id,date:b.date,hour:b.hour,allDay:b.all_day,reason:b.reason||""}; }));
      if(tsData&&Array.isArray(tsData)&&tsData.length>0) setTestsRaw(tsData.map(function(t){ return {id:t.id,name:t.name,text:t.text,stars:t.stars,date:t.date}; }));
      setLoading(false);
    }
    load();
  },[]);

  // Booking functions - passed to BookPage
  async function addBooking(newBk){
    await sbUpsert("bookings",{id:newBk.id,sid:newBk.sid,s_name:newBk.sName,s_email:newBk.sEmail,s_phone:newBk.sPhone,date:newBk.date,hour:newBk.hour,dur:newBk.dur,status:newBk.status,notes:newBk.notes});
    setBksRaw(function(prev){ return [...prev,newBk]; });
  }

  async function addStudent(newStu){
    await sbUpsert("students",{id:newStu.id,name:newStu.name,email:newStu.email,phone:newStu.phone,enrolled:newStu.enrolled,progress:newStu.progress,exam_ready:newStu.examReady,exam_date:newStu.examDate,exam_result:newStu.examResult});
    setStusRaw(function(prev){ return [...prev,newStu]; });
  }

  async function setStus(newStus){
    setStusRaw(newStus);
    var changed=newStus.filter(function(s){ var old=stus.find(function(x){ return x.id===s.id; }); return old&&JSON.stringify(old)!==JSON.stringify(s); });
    for(var j=0;j<changed.length;j++){ var sc=changed[j]; await sbUpdate("students",sc.id,{progress:sc.progress,exam_ready:sc.examReady,exam_date:sc.examDate,exam_result:sc.examResult}); }
  }

  async function setBlkd(newBlkd){
    var removed=blkd.filter(function(b){ return !newBlkd.find(function(x){ return x.id===b.id; }); });
    var added=newBlkd.filter(function(b){ return !blkd.find(function(x){ return x.id===b.id; }); });
    for(var i=0;i<removed.length;i++){ await sbDelete("blocked",removed[i].id); }
    for(var j=0;j<added.length;j++){ var bl=added[j]; await sbUpsert("blocked",{id:bl.id,date:bl.date,hour:bl.hour,all_day:bl.allDay,reason:bl.reason}); }
    setBlkdRaw(newBlkd);
  }

  async function setTests(newTests){
    var removed=tests.filter(function(t){ return !newTests.find(function(x){ return x.id===t.id; }); });
    var added=newTests.filter(function(t){ return !tests.find(function(x){ return x.id===t.id; }); });
    for(var i=0;i<removed.length;i++){ await sbDelete("testimonials",removed[i].id); }
    for(var j=0;j<added.length;j++){ var ts=added[j]; await sbUpsert("testimonials",{id:ts.id,name:ts.name,text:ts.text,stars:ts.stars,date:ts.date}); }
    setTestsRaw(newTests);
  }

  function go(p){ setPage(p); window.scrollTo(0,0); }

  if(loading) return React.createElement("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,"+NV+","+BL+")",flexDirection:"column",gap:16}},
    React.createElement("style",null,CSS),
    React.createElement(Logo,{size:60}),
    React.createElement("div",{style:{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,opacity:0.8}},"Loading...")
  );

  var pubNav=isInst
    ?[{id:"dashboard",l:"Home",n:"home"},{id:"diary",l:"Diary",n:"cal"},{id:"students",l:"Students",n:"user"},{id:"achieve",l:"Achieve",n:"trophy"}]
    :[{id:"home",l:"Home",n:"home"},{id:"book",l:"Book",n:"cal"},{id:"mybookings",l:"My Bookings",n:"user"},{id:"progress",l:"Progress",n:"bar"},{id:"reviews",l:"Reviews",n:"star"}];
  var xnav=isInst?{id:"x",l:"Logout",n:"logout"}:{id:"login",l:"Instructor",n:"lock"};

  return React.createElement(React.Fragment,null,
    React.createElement("style",null,CSS),
    React.createElement("div",{className:"app"},
      React.createElement("div",{className:"pg"},
        page==="home"       && React.createElement(HomePage,     {go:go,tests:tests}),
        page==="book"       && React.createElement(BookPage,     {go:go,bks:bks,stus:stus,addBooking:addBooking,addStudent:addStudent,blkd:blkd}),
        page==="mybookings" && React.createElement(MyBksPage,    {bks:bks,setBksRaw:setBksRaw}),
        page==="progress"   && React.createElement(ProgPage,     {stus:stus,bks:bks}),
        page==="reviews"    && React.createElement(RevPage,      {tests:tests}),
        page==="contact"    && React.createElement(ContactPage,  {go:go}),
        page==="faq"        && React.createElement(FaqPage,      null),
        page==="login"      && React.createElement(LoginPage,    {setIsInst:setIsInst,go:go}),
        page==="dashboard"  && isInst && React.createElement(DashPage, {bks:bks,stus:stus,go:go}),
        page==="diary"      && isInst && React.createElement(DiaryPage,{bks:bks,setBksRaw:setBksRaw,blkd:blkd,setBlkd:setBlkd}),
        page==="students"   && isInst && React.createElement(StusPage, {stus:stus,setStus:setStus,bks:bks}),
        page==="achieve"    && isInst && React.createElement(AchvPage, {tests:tests,setTests:setTests})
      ),
      React.createElement("div",{style:{position:"fixed",bottom:170,right:16,zIndex:300,display:"flex",alignItems:"center",gap:8}},
        phoneOpen&&React.createElement("a",{href:"tel:"+PHONE,className:"ppill",style:{display:"flex",alignItems:"center",gap:8,background:GR,borderRadius:24,padding:"10px 16px",color:"#fff",textDecoration:"none",fontWeight:700,fontSize:14,boxShadow:"0 4px 20px rgba(16,185,129,0.4)",whiteSpace:"nowrap",fontFamily:"'Plus Jakarta Sans',sans-serif"}},
          React.createElement(Ico,{n:"phone",sz:16,c:"#fff"})," ",PHONED
        ),
        React.createElement("button",{onClick:function(){ setPhoneOpen(function(p){ return !p; }); },style:{width:48,height:48,borderRadius:"50%",background:phoneOpen?RD:GR,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(16,185,129,0.5)",transition:"all 0.2s"}},
          React.createElement(Ico,{n:phoneOpen?"x":"phone",sz:20,c:"#fff"})
        )
      ),
      React.createElement("nav",{className:"nav"},
        React.createElement("div",{className:"nav-inner"},
          pubNav.map(function(item){
            return React.createElement("button",{key:item.id,className:"nb"+(page===item.id?" on":""),onClick:function(){ go(item.id); }},
              React.createElement(Ico,{n:item.n,sz:19,c:page===item.id?"#fff":"rgba(255,255,255,0.4)",sw:page===item.id?2.5:2}),
              React.createElement("span",null,item.l)
            );
          }),
          React.createElement("button",{className:"nb"+(page===xnav.id||page==="dashboard"||page==="diary"||page==="students"||page==="achieve"?" on":""),onClick:function(){ if(isInst){setIsInst(false);go("home");}else go("login"); }},
            React.createElement(Ico,{n:xnav.n,sz:19,c:(page===xnav.id||isInst)?"#fff":"rgba(255,255,255,0.4)"}),
            React.createElement("span",null,xnav.l)
          )
        )
      )
    )
  );
}

function CarSection() {
  var badges = [["Dual Control","shield",B],["Modern Car","award",GD],["Auto & Manual","check",GR]];
  return React.createElement("div",{style:{background:"#F0F4FF",borderBottom:"1px solid #E2E8F0",position:"relative"}},
    React.createElement("div",{style:{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,"+B+","+NV+")"}}),
    React.createElement("div",{className:"d-hide"},
      React.createElement("div",{style:{padding:"28px 20px 0"}},
        React.createElement("h2",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:NV,lineHeight:1.2,marginBottom:6}},"Your Road to ",React.createElement("span",{style:{color:B}},"Confidence")),
        React.createElement("p",{style:{fontSize:13,color:SL,lineHeight:1.6,marginBottom:14}},"Learn in our modern dual-control Toyota Corolla with an Ex-VicRoads licence testing officer by your side."),
        React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:8}},
          badges.map(function(row){ return React.createElement("div",{key:row[0],style:{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",background:row[2]+"15",borderRadius:20,border:"1px solid "+row[2]+"40"}},React.createElement(Ico,{n:row[1],sz:13,c:row[2]}),React.createElement("span",{style:{fontSize:11,fontWeight:700,color:row[2]}},row[0])); })
        )
      ),
      React.createElement("div",{style:{position:"relative",height:240,marginTop:10,overflow:"hidden"}},
        React.createElement("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"url("+CAR1+")",backgroundSize:"contain",backgroundPosition:"center bottom",backgroundRepeat:"no-repeat"}}),
        React.createElement("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(to top,#F0F4FF,transparent)"}})
      )
    ),
    React.createElement("div",{className:"d-show",style:{display:"none"}},
      React.createElement("div",{style:{maxWidth:1200,margin:"0 auto",padding:"0 48px",display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",minHeight:440}},
        React.createElement("div",{style:{padding:"60px 48px 60px 0"}},
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:B,letterSpacing:2,textTransform:"uppercase",marginBottom:12}},"Our Training Vehicle"),
          React.createElement("h2",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:38,fontWeight:800,color:NV,lineHeight:1.2,marginBottom:16}},"Your Road to ",React.createElement("span",{style:{color:B}},"Confidence")),
          React.createElement("p",{style:{fontSize:15,color:SL,lineHeight:1.8,marginBottom:28,maxWidth:420}},"Learn in our modern dual-control Toyota Corolla with an Ex-VicRoads licence testing officer by your side. You are always safe."),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:10}},
            badges.map(function(row){ return React.createElement("div",{key:row[0],style:{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",background:row[2]+"12",borderRadius:24,border:"1.5px solid "+row[2]+"40"}},React.createElement(Ico,{n:row[1],sz:15,c:row[2]}),React.createElement("span",{style:{fontSize:13,fontWeight:700,color:row[2]}},row[0])); })
          )
        ),
        React.createElement("div",{style:{height:440,display:"flex",alignItems:"center",justifyContent:"center",overflow:"visible"}},
          React.createElement("img",{src:CAR1,alt:"Steer Assist Car",style:{width:"150%",maxWidth:"none",objectFit:"contain",objectPosition:"center"},onError:function(e){e.target.style.display="none";}})
        )
      )
    )
  );
}

function PkgsSection(props) {
  var go=props.go, desktop=props.desktop||false;
  var r=React.useState("auto"); var mode=r[0]; var setMode=r[1];
  return React.createElement("div",{style:{padding:"0 0 4px"}},
    !desktop&&React.createElement("div",{className:"pkgs-hdr",style:{padding:"0 20px",marginBottom:16}},
      React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:NV,marginBottom:4}},"Lesson Packages"),
      React.createElement("div",{style:{fontSize:13,color:SL,marginBottom:16}},"Transparent pricing - no hidden fees"),
      React.createElement("div",{style:{display:"flex",justifyContent:"center"}},
        React.createElement("div",{style:{display:"inline-flex",background:"#E8F0FE",borderRadius:30,padding:3,gap:2}},
          ["auto","manual"].map(function(m){
            var active=mode===m;
            return React.createElement("button",{key:m,onClick:function(){setMode(m);},style:{padding:"8px 24px",borderRadius:26,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all 0.2s",background:active?"linear-gradient(135deg,"+B+","+NV+")":"transparent",color:active?"#fff":SL,boxShadow:active?"0 2px 8px rgba(46,134,222,0.35)":"none"}},m==="auto"?"Automatic":"Manual");
          })
        )
      )
    ),
    React.createElement("div",{className:"pkgs-grid",style:{display:"grid",gridTemplateColumns:desktop?"repeat(4,1fr)":"1fr 1fr",gap:desktop?20:12,padding:desktop?"20px 0 0":"20px 16px 0",alignItems:"stretch",gridAutoRows:"1fr"}},
      PKGS.map(function(p){
        var price=mode==="auto"?p.aPrice:p.mPrice;
        var oldPrice=mode==="auto"?p.aOld:p.mOld;
        return React.createElement("div",{key:p.id,className:"pkgc",style:{background:"#fff",borderRadius:20,padding:"18px 14px 16px",boxShadow:p.pop?"0 8px 32px rgba(46,134,222,0.2)":"0 4px 16px rgba(0,0,0,0.06)",border:p.pop?"2px solid "+B:"2px solid #F1F5F9",position:"relative",display:"flex",flexDirection:"column"}},
          p.pop&&React.createElement("div",{style:{position:"absolute",top:10,right:10,background:"linear-gradient(135deg,"+B+","+NV+")",color:"#fff",fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}},"POPULAR"),
          React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,color:NV,marginBottom:4}},p.name),
          React.createElement("div",{style:{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}},React.createElement("span",{style:{textDecoration:"line-through",color:MT,fontSize:11}},"$"+oldPrice),React.createElement("span",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:p.pop?B:NV}},"$"+price)),
          React.createElement("div",{style:{fontSize:11,color:SL,lineHeight:1.4,marginBottom:10}},p.desc),
          React.createElement("div",{style:{flex:1,marginBottom:12,minHeight:90}},p.feats.map(function(f){ return React.createElement("div",{key:f,style:{display:"flex",alignItems:"flex-start",gap:5,marginBottom:4}},React.createElement("div",{style:{width:14,height:14,borderRadius:"50%",background:GR+"20",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}},React.createElement(Ico,{n:"check",sz:9,c:GR,sw:3})),React.createElement("span",{style:{fontSize:11,color:SL}},f)); })),
          React.createElement("button",{className:"pkgbtn",onClick:function(){go("contact");},style:{width:"100%",padding:"9px 8px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}},"Enquire Now")
        );
      })
    ),
    React.createElement("div",{className:"pkgs-note",style:{margin:desktop?"14px 0 8px":"14px 16px 8px",padding:"12px 16px",background:"#EFF6FF",borderRadius:14,display:"flex",alignItems:"flex-start",gap:8}},
      React.createElement(Ico,{n:"qm",sz:15,c:B}),
      React.createElement("span",{style:{fontSize:12,color:BL,lineHeight:1.6}},"We can also alter the packages according to your need. Please call or message us for more info.")
    )
  );
}

function VicRoadsSection() {
  var PDF_URL="https://www.vicroads.vic.gov.au/~/media/files/formsandpublications/licences/driving_instructors_drive_test_criteria.pdf";
  return React.createElement("div",{className:"vic-wrap",style:{margin:"20px 16px 0"}},
    React.createElement("div",{style:{background:"linear-gradient(135deg,#F5A623 0%,#E8920A 100%)",borderRadius:20,overflow:"hidden",position:"relative"}},
      React.createElement("div",{style:{position:"absolute",top:-30,right:-30,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}),
      React.createElement("div",{style:{padding:"20px 20px 16px",position:"relative",zIndex:2}},
        React.createElement("div",{style:{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}},
          React.createElement("div",{style:{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
            React.createElement("svg",{width:26,height:26,viewBox:"0 0 24 24",fill:"none",stroke:NV,strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),React.createElement("polyline",{points:"14,2 14,8 20,8"}),React.createElement("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),React.createElement("line",{x1:"16",y1:"17",x2:"8",y2:"17"}))
          ),
          React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV,lineHeight:1.3}},"VicRoads Drive Test Criteria Book"),React.createElement("div",{style:{fontSize:12,color:"rgba(10,22,40,0.65)",marginTop:2}},"Free official guide - know what examiners look for"))
        ),
        React.createElement("p",{style:{fontSize:13,color:"rgba(10,22,40,0.8)",lineHeight:1.6,marginBottom:16}},"The same guide our Ex-VicRoads instructor trained on. Download it free and know exactly what to expect on test day."),
        React.createElement("a",{href:PDF_URL,target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 20px",background:NV,borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:13,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 4px 16px rgba(10,22,40,0.25)"}},React.createElement(Ico,{n:"dl",sz:15,c:GD}),"Download Free PDF")
      ),
      React.createElement("div",{style:{height:180,position:"relative",overflow:"hidden"}},
        React.createElement("div",{style:{position:"absolute",bottom:0,left:0,right:0,top:0,backgroundImage:"url("+CAR2+")",backgroundSize:"70%",backgroundPosition:"center bottom",backgroundRepeat:"no-repeat"}}),
        React.createElement("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(to top,#E8920A 0%,transparent 100%)"}})
      )
    )
  );
}

function HomePage(props) {
  var go=props.go, tests=props.tests;
  var r=useState(false); var on=r[0]; var setOn=r[1];
  useEffect(function(){ setTimeout(function(){ setOn(true); },50); },[]);
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+" 0%,"+BL+" 55%,"+B+" 100%)",position:"relative",overflow:"hidden"}},
      React.createElement("div",{style:{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}),
      React.createElement("div",{style:{position:"absolute",bottom:-60,left:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.02)"}}),
      React.createElement("div",{className:"d-hide",style:{padding:"24px 20px 28px"}},
        React.createElement("a",{href:"https://www.google.com/search?hl=en-GB&gl=uk&q=Steer+Assist+Driving+School&ludocid=6497258942805452546&lsig=AB86z5U4Nbz0nnmDGMO1qd9uc-f9#",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:30,padding:"6px 14px",marginBottom:16,textDecoration:"none"}},
          React.createElement("svg",{width:15,height:15,viewBox:"0 0 24 24"},React.createElement("path",{d:"M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z",fill:"#fff"})),
          React.createElement("span",{style:{color:"#fff",fontSize:12,fontWeight:700}},"5.0"),
          React.createElement("span",{style:{color:GD,fontSize:13}},"★★★★★"),
          React.createElement("span",{style:{color:"rgba(255,255,255,0.6)",fontSize:11}},"Google Reviews")
        ),
        React.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}},
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:12}},React.createElement(Logo,{size:46}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"#fff",lineHeight:1}},"Steer Assist Driving School"),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}},"Melbourne"))),
          React.createElement("div",{className:"sbadge",style:{padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:800,color:NV}},"EX-VICROADS")
        ),
        React.createElement("div",{className:on?"u1":""},
          React.createElement("div",{style:{fontSize:11,fontWeight:700,color:GD,letterSpacing:2,textTransform:"uppercase",marginBottom:8}},"Trusted . Experienced . Local"),
          React.createElement("h1",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:30,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:10}},"Welcome to",React.createElement("br"),React.createElement("span",{style:{color:GD}},"Steer Assist")),
          React.createElement("p",{style:{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.6,marginBottom:6}},"Ex-VicRoads Licence Testing Officer with ",React.createElement("strong",{style:{color:"#fff"}},"2,500+ tests experience.")," We know exactly what examiners look for.")
        ),
        React.createElement("div",{className:on?"u2":"",style:{display:"flex",gap:6,marginTop:20,flexWrap:"nowrap",overflowX:"auto"}},
          React.createElement(Btn,{onClick:function(){go("book");},v:"gold",sm:true},React.createElement(Ico,{n:"cal",sz:15,c:NV})," Book Lesson"),
          React.createElement("button",{onClick:function(){go("reviews");},style:{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer"}},React.createElement(Ico,{n:"star",sz:14,c:GD})," Reviews"),
          React.createElement("button",{onClick:function(){go("contact");},style:{display:"flex",alignItems:"center",gap:6,padding:"11px 16px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:13,color:"#fff",cursor:"pointer"}},React.createElement(Ico,{n:"mail",sz:14,c:"#fff"})," Get Quote")
        )
      ),
      React.createElement("div",{className:"d-show d-hero",style:{display:"none"}},
        React.createElement("div",{className:"d-hero-text"},
          React.createElement("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:24}},
            React.createElement(Logo,{size:52}),
            React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1}},"Steer Assist Driving School"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}},"Melbourne, Victoria"),React.createElement("div",{className:"sbadge",style:{display:"inline-block",marginTop:6,padding:"3px 12px",borderRadius:20,fontSize:10,fontWeight:800,color:NV}},"EX-VICROADS OFFICER"))
          ),
          React.createElement("a",{href:"https://www.google.com/search?hl=en-GB&gl=uk&q=Steer+Assist+Driving+School&ludocid=6497258942805452546&lsig=AB86z5U4Nbz0nnmDGMO1qd9uc-f9#",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:30,padding:"6px 16px",marginBottom:20,textDecoration:"none"}},
            React.createElement("svg",{width:15,height:15,viewBox:"0 0 24 24"},React.createElement("path",{d:"M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z",fill:"#fff"})),
            React.createElement("span",{style:{color:"#fff",fontSize:13,fontWeight:700}},"5.0"),React.createElement("span",{style:{color:GD,fontSize:14}},"★★★★★"),React.createElement("span",{style:{color:"rgba(255,255,255,0.7)",fontSize:12}},"Google Reviews")
          ),
          React.createElement("div",{style:{fontSize:12,fontWeight:700,color:GD,letterSpacing:3,textTransform:"uppercase",marginBottom:12}},"Trusted . Experienced . Local"),
          React.createElement("h1",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:52,fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:16}},"Welcome to",React.createElement("br"),React.createElement("span",{style:{color:GD}},"Steer Assist")),
          React.createElement("p",{style:{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.7,marginBottom:8,maxWidth:480}},"Ex-VicRoads Licence Testing Officer with ",React.createElement("strong",{style:{color:"#fff"}},"2,500+ tests experience.")," We know exactly what examiners look for on test day."),
          React.createElement("div",{style:{display:"flex",gap:12,marginTop:28,alignItems:"center"}},
            React.createElement(Btn,{onClick:function(){go("book");},v:"gold"},React.createElement(Ico,{n:"cal",sz:18,c:NV})," Book a Lesson"),
            React.createElement("button",{onClick:function(){go("reviews");},style:{display:"flex",alignItems:"center",gap:8,padding:"13px 22px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:15,color:"#fff",cursor:"pointer"}},React.createElement(Ico,{n:"star",sz:16,c:GD})," Reviews"),
            React.createElement("button",{onClick:function(){go("contact");},style:{display:"flex",alignItems:"center",gap:8,padding:"13px 22px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:15,color:"#fff",cursor:"pointer"}},React.createElement(Ico,{n:"mail",sz:16,c:"#fff"})," Get Quote")
          )
        ),
        React.createElement("div",{className:"d-hero-right",style:{display:"none",paddingTop:0,justifyContent:"flex-end"}},
          [["2,500+","Tests Conducted","trophy",GD],["5+","Years Experience","award",GD],["99%","Pass Rate","star","#fff"],["12+","Suburbs Covered","shield","#fff"]].map(function(row){
            return React.createElement("div",{key:row[0],style:{display:"flex",alignItems:"center",gap:16,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:16,padding:"14px 20px",width:"100%"}},
              React.createElement("div",{style:{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},React.createElement(Ico,{n:row[2],sz:20,c:row[3]})),
              React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:row[3]}},row[0]),React.createElement("div",{style:{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2,fontWeight:600}},row[1]))
            );
          })
        )
      )
    ),
    React.createElement(CarSection,null),
    React.createElement("div",{style:{background:"#1A1A2E",height:64,overflow:"hidden",position:"relative",flexShrink:0}},
      React.createElement("div",{style:{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+GD+","+AM+")"}}),
      React.createElement("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+GD+","+AM+")"}}),
      React.createElement("div",{className:"roadanim",style:{position:"absolute",top:"50%",transform:"translateY(-50%)",display:"flex",width:"200%",alignItems:"center"}},
        Array.from({length:40},function(_,i){ return React.createElement("div",{key:i,style:{flexShrink:0,width:48,height:6,background:"rgba(255,255,255,0.8)",borderRadius:3,marginRight:32}}); })
      )
    ),
    React.createElement("div",{className:"d-stats",style:{background:"#fff",display:"grid",gridTemplateColumns:"repeat(4,1fr)",margin:"24px 16px 0",borderRadius:16,boxShadow:"0 4px 24px rgba(10,22,40,0.08)",overflow:"hidden"}},
      [["2,500+","Students"],["99%","Pass Rate"],["5+","Yrs Exp"],["2,500+","Tests"]].map(function(item,i){
        return React.createElement("div",{key:item[1],style:{textAlign:"center",padding:"20px 8px",borderRight:i<3?"1px solid #F1F5F9":"none"}},
          React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:B}},item[0]),
          React.createElement("div",{style:{fontSize:11,color:MT,fontWeight:600,marginTop:3}},item[1])
        );
      })
    ),
    React.createElement("div",{className:"d-hide",style:{padding:"28px 20px 0"}},
      React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:NV,marginBottom:4}},"How It Works"),
      React.createElement("div",{style:{fontSize:13,color:SL,marginBottom:16}},"Three simple steps to your licence"),
      [["01","Book Online","Pick your day and time. Single or multi-book.","cal",B],["02","Learn & Track","Structured lessons with topic-by-topic tracking.","bar",GD],["03","Pass Your Test","We mark you ready and guide you through the test.","award",GR]].map(function(row,i){
        return React.createElement("div",{key:row[0],style:{display:"flex",gap:14,paddingBottom:20,position:"relative"}},
          i<2&&React.createElement("div",{style:{position:"absolute",left:20,top:44,width:2,height:"calc(100% - 16px)",background:row[4]+"40"}}),
          React.createElement("div",{style:{width:42,height:42,borderRadius:12,background:row[4]+"20",border:"2px solid "+row[4]+"40",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},React.createElement(Ico,{n:row[3],sz:18,c:row[4]})),
          React.createElement("div",null,React.createElement("div",{style:{fontSize:10,fontWeight:800,color:row[4],letterSpacing:1,textTransform:"uppercase",marginBottom:2}},row[0]),React.createElement("div",{style:{fontWeight:800,fontSize:15,color:NV,marginBottom:3}},row[1]),React.createElement("div",{style:{fontSize:12,color:SL,lineHeight:1.55}},row[2]))
        );
      })
    ),
    React.createElement("div",{className:"d-show d-how",style:{display:"none"}},
      React.createElement("div",{style:{textAlign:"center",marginBottom:8}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:32,fontWeight:800,color:NV,marginBottom:8}},"How It Works"),React.createElement("div",{style:{fontSize:15,color:SL}},"Three simple steps to your licence")),
      React.createElement("div",{className:"d-how-grid"},
        [["01","Book Online","Pick your preferred day and time. Book single or multiple lessons at once.","cal",B],["02","Learn & Track","Structured lessons with topic-by-topic progress tracking every session.","bar",GD],["03","Pass Your Test","We mark you exam-ready and guide you through the VicRoads test process.","award",GR]].map(function(row){
          return React.createElement("div",{key:row[0],className:"d-how-card"},React.createElement("div",{style:{width:60,height:60,borderRadius:16,background:row[4]+"15",border:"2px solid "+row[4]+"30",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}},React.createElement(Ico,{n:row[3],sz:28,c:row[4]})),React.createElement("div",{style:{fontSize:11,fontWeight:800,color:row[4],letterSpacing:2,textTransform:"uppercase",marginBottom:8}},row[0]),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,color:NV,marginBottom:10}},row[1]),React.createElement("div",{style:{fontSize:14,color:SL,lineHeight:1.7}},row[2]));
        })
      )
    ),
    React.createElement("div",{className:"d-show d-pkgs",style:{display:"none"}},
      React.createElement("div",{style:{textAlign:"center",marginBottom:8}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:32,fontWeight:800,color:NV,marginBottom:8}},"Lesson Packages"),React.createElement("div",{style:{fontSize:15,color:SL,marginBottom:20}},"Transparent pricing - no hidden fees")),
      React.createElement(PkgsSection,{go:go,desktop:true})
    ),
    React.createElement("div",{className:"d-hide"},React.createElement(PkgsSection,{go:go,desktop:false})),
    React.createElement("div",{className:"d-hide",style:{background:"linear-gradient(135deg,"+NV+","+BL+")",margin:"16px 16px 0",borderRadius:20,padding:20,position:"relative",overflow:"hidden"}},
      React.createElement("div",{style:{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}),
      React.createElement("div",{style:{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}},
        React.createElement("div",{style:{width:52,height:52,borderRadius:14,background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},React.createElement(Ico,{n:"shield",sz:24,c:GD})),
        React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:"#fff",lineHeight:1.3}},"Ex-VicRoads Licence Testing Officer"),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}},"2,500+ Tests Conducted"))
      ),
      React.createElement("p",{style:{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.65,marginBottom:14}},"Our instructor brings first-hand experience from inside the test centre. We know exactly what examiners look for on test day."),
      React.createElement("div",{style:{fontWeight:700,fontSize:12,color:GD,marginBottom:10}},"Servicing all of Melbourne & Surrounds"),
      React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},SUBURBS.map(function(s){ return React.createElement("span",{key:s,style:{background:"rgba(255,255,255,0.1)",borderRadius:20,padding:"3px 10px",fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600}},s); }))
    ),
    React.createElement("div",{className:"d-show d-about",style:{display:"none"}},
      React.createElement("div",{className:"d-about-inner"},
        React.createElement("div",{className:"d-about-left"},
          React.createElement("div",{style:{display:"flex",gap:16,alignItems:"flex-start",marginBottom:24}},
            React.createElement("div",{style:{width:60,height:60,borderRadius:16,background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},React.createElement(Ico,{n:"shield",sz:28,c:GD})),
            React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.3}},"Ex-VicRoads Licence Testing Officer"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:4}},"2,500+ Tests Conducted"))
          ),
          React.createElement("p",{style:{fontSize:15,color:"rgba(255,255,255,0.8)",lineHeight:1.8,marginBottom:28}},"Our instructor brings first-hand experience from inside the test centre. We train you exactly the way examiners assess - because we know exactly what they look for."),
          React.createElement("div",{style:{display:"flex",gap:12}},
            React.createElement(Btn,{onClick:function(){go("book");},v:"gold"},React.createElement(Ico,{n:"cal",sz:16,c:NV})," Book a Lesson"),
            React.createElement("button",{onClick:function(){go("contact");},style:{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontWeight:700,fontSize:14,color:"#fff",cursor:"pointer"}},React.createElement(Ico,{n:"phone",sz:16,c:"#fff"})," Call Us")
          )
        ),
        React.createElement("div",{className:"d-about-right"},
          React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:20}},"Servicing all of Melbourne & Surrounds"),
          React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:8}},SUBURBS.map(function(s){ return React.createElement("span",{key:s,style:{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"6px 14px",fontSize:13,color:"#fff",fontWeight:600}},s); }))
        )
      )
    ),
    React.createElement("div",{className:"wrap",style:{padding:"20px 0 0"}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
        React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:NV}},"Google Reviews"),
        React.createElement("a",{href:"https://www.google.com/search?hl=en-GB&gl=uk&q=Steer+Assist+Driving+School&ludocid=6497258942805452546&lsig=AB86z5U4Nbz0nnmDGMO1qd9uc-f9#",target:"_blank",rel:"noopener noreferrer",style:{fontSize:13,color:B,fontWeight:700,textDecoration:"none"}},"See all")
      ),
      React.createElement(ElfsightWidget,null)
    ),
    React.createElement("div",{className:"d-hide"},React.createElement(VicRoadsSection,null)),
    React.createElement("div",{className:"d-show d-vic",style:{display:"none"}},
      React.createElement("div",{className:"d-vic-inner"},
        React.createElement("div",{className:"d-vic-text"},
          React.createElement("div",{style:{display:"flex",gap:16,alignItems:"flex-start",marginBottom:20}},
            React.createElement("div",{style:{width:56,height:56,borderRadius:14,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
              React.createElement("svg",{width:28,height:28,viewBox:"0 0 24 24",fill:"none",stroke:NV,strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round"},React.createElement("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),React.createElement("polyline",{points:"14,2 14,8 20,8"}),React.createElement("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),React.createElement("line",{x1:"16",y1:"17",x2:"8",y2:"17"}))
            ),
            React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:NV,lineHeight:1.3}},"VicRoads Drive Test Criteria Book"),React.createElement("div",{style:{fontSize:13,color:"rgba(10,22,40,0.65)",marginTop:4}},"Free official guide - know what examiners look for"))
          ),
          React.createElement("p",{style:{fontSize:15,color:"rgba(10,22,40,0.8)",lineHeight:1.75,marginBottom:28}},"The same guide our Ex-VicRoads instructor trained on. Download it free and know exactly what to expect on test day."),
          React.createElement("a",{href:"https://www.vicroads.vic.gov.au/~/media/files/formsandpublications/licences/driving_instructors_drive_test_criteria.pdf",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 28px",background:NV,borderRadius:14,textDecoration:"none",fontWeight:700,fontSize:15,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 4px 20px rgba(10,22,40,0.3)"}},React.createElement(Ico,{n:"dl",sz:18,c:GD}),"Download Free PDF")
        ),
        React.createElement("div",{className:"d-vic-car"},React.createElement("img",{src:CAR2,alt:"Toyota Corolla",style:{width:"90%",maxWidth:420,objectFit:"contain",objectPosition:"bottom",display:"block"},onError:function(e){e.target.style.display="none";}}))
      )
    ),
    React.createElement("div",{className:"d-faq",style:{margin:"20px 16px 0"}},
      React.createElement("div",{style:{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}},
        React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV,marginBottom:4}},"Got Questions?"),React.createElement("div",{style:{fontSize:13,color:SL}},"Browse our frequently asked questions")),
        React.createElement(Btn,{onClick:function(){go("faq");},sm:true},"View FAQs")
      )
    ),
    React.createElement("div",{className:"d-soc",style:{margin:"16px 16px 24px",display:"flex",gap:10}},
      React.createElement(SBtn,{href:IG},React.createElement(IgIco,{sz:17})," Instagram"),
      React.createElement(SBtn,{href:FB},React.createElement(FbIco,{sz:17})," Facebook"),
      React.createElement(SBtn,{href:WA},React.createElement(WaIco,{sz:17})," WhatsApp")
    )
  );
}

function BookPage(props) {
  var go=props.go,bks=props.bks,stus=props.stus,addBooking=props.addBooking,addStudent=props.addStudent,blkd=props.blkd;
  var r1=useState(1); var step=r1[0]; var setStep=r1[1];
  var r2=useState({name:"",email:"",phone:"",notes:""}); var form=r2[0]; var setForm=r2[1];
  var r3=useState([]); var slots=r3[0]; var setSlots=r3[1];
  var r4=useState(tod()); var anchor=r4[0]; var setAnchor=r4[1];
  var r5=useState(60); var dur=r5[0]; var setDur=r5[1];
  var r6=useState({}); var errs=r6[0]; var setErrs=r6[1];
  var r7=useState(false); var submitting=r7[0]; var setSubmitting=r7[1];
  var txRef=useRef(null);
  var wk=wkOf(anchor);
  function isBl(d,h){ return blkd.some(function(b){ return b.date===d&&(b.allDay||b.hour===h); }); }
  function isBk(d,h){ return bks.some(function(b){ return b.date===d&&b.hour===h&&b.status!=="cancelled"; }); }
  function isSl(d,h){ return slots.some(function(s){ return s.date===d&&s.hour===h; }); }
  function isPst(d,h){ return new Date(d+"T"+String(h).padStart(2,"0")+":00:00")<new Date(); }
  function tog(d,h){ if(isBk(d,h)||isBl(d,h)||isPst(d,h)) return; setSlots(function(p){ return p.some(function(s){ return s.date===d&&s.hour===h; })?p.filter(function(s){ return !(s.date===d&&s.hour===h); }):[...p,{date:d,hour:h,dur:dur}]; }); }
  function onTS(e){ txRef.current=e.touches[0].clientX; }
  function onTE(e){ if(txRef.current===null) return; var diff=txRef.current-e.changedTouches[0].clientX; if(Math.abs(diff)>50){ diff>0?setAnchor(addD(wk[0],7)):setAnchor(addD(wk[0],-7)); } txRef.current=null; }
  function validate(){ var e={}; if(!form.name.trim()) e.name="Required"; if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Valid email required"; if(!form.phone.trim()) e.phone="Required"; setErrs(e); return Object.keys(e).length===0; }

  async function confirm(){
    if(submitting) return;
    setSubmitting(true);
    var slotsCopy=[...slots];
      var stCurrent=stus.find(function(s){ return s.email.toLowerCase()===form.email.toLowerCase(); });
      if(!stCurrent){
        stCurrent={id:uid(),name:form.name,email:form.email,phone:form.phone,enrolled:tod(),progress:Object.fromEntries(TOPICS.map(function(t){ return [t,false]; })),examReady:false,examDate:null,examResult:null};
        await addStudent(stCurrent);
      }
      for(var bi=0;bi<slotsCopy.length;bi++){
        var sl=slotsCopy[bi];
        var newBk={id:uid(),sid:stCurrent.id,sName:form.name,sEmail:form.email,sPhone:form.phone,date:sl.date,hour:sl.hour,dur:sl.dur,status:"confirmed",notes:form.notes};
        await addBooking(newBk);
      }
      var lessonDateStr=slotsCopy.map(function(sl){ return fmtD(sl.date)+" at "+fmtT(sl.hour); }).join(", ");
      var lessonTimeStr=slotsCopy.length>0?fmtT(slotsCopy[0].hour):"";
      console.log("Sending email to:",form.email,"lesson:",lessonDateStr);
      fetch("https://api.emailjs.com/api/v1.0/email/send",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          service_id:EJS_SVC,
          template_id:"template_rb0zdba",
          user_id:EJS_KEY,
          template_params:{
            student_name:form.name,
            student_email:form.email,
            lesson_date:lessonDateStr,
            lesson_time:lessonTimeStr,
            pickup_location:form.notes||"To be confirmed"
          }
        })
      }).then(function(r){ return r.text(); }).then(function(t){ console.log("Email sent:",t); }).catch(function(e){ console.log("Email failed:",e); });
      setStep(4);
      setSubmitting(false);
  }

  function Hdr(){ return React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 16px",color:"#fff"}},React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12,marginBottom:16}},React.createElement(Logo,{size:38}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Book a Lesson"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},"Step "+Math.min(step,3)+" of 3"))),React.createElement("div",{className:"wrap",style:{display:"flex",gap:6}},["Details","Pick Slots","Confirm"].map(function(s,i){ return React.createElement("div",{key:s,style:{flex:1}},React.createElement("div",{style:{height:3,borderRadius:4,background:step>i+1?"#fff":step===i+1?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.25)",transition:"all 0.3s"}}),React.createElement("div",{style:{fontSize:10,color:step>=i+1?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.35)",marginTop:4,fontWeight:600}},s)); }))); }
  if(step===1) return React.createElement("div",null,React.createElement(Hdr),React.createElement("div",{style:{padding:16},className:"wrap"},React.createElement(Crd,{style:{margin:0}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV,marginBottom:4}},"Your Details"),React.createElement("div",{style:{fontSize:13,color:SL,marginBottom:20}},"We will use these to confirm your booking"),[["name","Full Name","text","John Smith"],["email","Email","email","john@example.com"],["phone","Phone","tel","0412 345 678"]].map(function(row){ var k=row[0],label=row[1],type=row[2],ph=row[3]; return React.createElement("div",{key:k,style:{marginBottom:14}},React.createElement(Lbl,null,label),React.createElement(Inp,{value:form[k],onChange:function(e){ setForm(Object.assign({},form,{[k]:e.target.value})); },placeholder:ph,type:type,err:errs[k]}),errs[k]&&React.createElement("div",{style:{fontSize:12,color:RD,marginTop:3}},errs[k])); }),React.createElement("div",{style:{marginBottom:14}},React.createElement(Lbl,null,"Duration"),React.createElement("div",{style:{display:"flex",gap:8}},[60,90,120].map(function(d){ return React.createElement("button",{key:d,onClick:function(){ setDur(d); },style:{flex:1,padding:"11px 4px",borderRadius:12,border:"2px solid "+(dur===d?B:LN),background:dur===d?"#EFF6FF":"#F8FAFC",fontWeight:700,fontSize:14,cursor:"pointer",color:dur===d?B:SL}},d===60?"1 hr":d===90?"1.5 hr":"2 hr"); }))),React.createElement("div",{style:{marginBottom:20}},React.createElement(Lbl,null,"Notes (optional)"),React.createElement(Inp,{value:form.notes,onChange:function(e){ setForm(Object.assign({},form,{notes:e.target.value})); },placeholder:"Any special requirements...",multi:true})),React.createElement(Btn,{onClick:function(){ if(validate()) setStep(2); },full:true},"Next: Pick Your Slots"))));
  if(step===2) return React.createElement("div",{onTouchStart:onTS,onTouchEnd:onTE},React.createElement(Hdr),React.createElement("div",{style:{background:"#fff",padding:"12px 16px 0",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}},React.createElement("div",{className:"wrap",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV}},new Date(wk[0]+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short"})+" - "+new Date(wk[6]+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"})),React.createElement("div",{style:{display:"flex",gap:6}},React.createElement("button",{onClick:function(){ setAnchor(addD(wk[0],-7)); },style:{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}},React.createElement(Ico,{n:"cL",sz:15,c:SL})),React.createElement("button",{onClick:function(){ setAnchor(addD(wk[0],7)); },style:{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}},React.createElement(Ico,{n:"cR",sz:15,c:SL})))),React.createElement("div",{style:{fontSize:11,color:MT,marginBottom:8}},"Swipe left or right to change week"),React.createElement("div",{style:{display:"flex",gap:8,paddingBottom:10}},[["#EFF6FF",B,"Available"],["#D1FAE5",GR,"Selected"],["#FEF3C7","#B45309","Booked"]].map(function(row){ return React.createElement("div",{key:row[2],style:{display:"flex",alignItems:"center",gap:4,fontSize:10}},React.createElement("div",{style:{width:12,height:12,borderRadius:3,background:row[0],border:"1.5px solid "+row[1]}}),React.createElement("span",{style:{color:MT,fontWeight:600}},row[2])); }))),React.createElement("div",{style:{overflowX:"auto",overflowY:"auto",maxHeight:"calc(100vh - 320px)",WebkitOverflowScrolling:"touch",background:"#fff"}},React.createElement("table",{style:{borderCollapse:"collapse",tableLayout:"fixed",width:"100%",minWidth:wk.length*54+62}},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",{style:{width:62,minWidth:62,position:"sticky",left:0,top:0,zIndex:10,background:"#fff",borderBottom:"2px solid "+LN,borderRight:"1px solid "+LN,padding:0}}),wk.map(function(d,di){ var isT=d===tod(),isPD=d<tod(); return React.createElement("th",{key:d,style:{width:54,position:"sticky",top:0,zIndex:5,background:isT?"#EFF6FF":"#fff",borderBottom:"2px solid "+(isT?B:LN),borderLeft:"1px solid "+LN,padding:"6px 2px",textAlign:"center"}},React.createElement("div",{style:{fontSize:10,fontWeight:700,color:isT?B:MT}},DNAMES[di]),React.createElement("div",{style:{width:28,height:28,borderRadius:"50%",background:isT?B:"transparent",color:isT?"#fff":isPD?MT:NV,display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto 1px",fontSize:14,fontWeight:800}},new Date(d+"T12:00:00").getDate()),React.createElement("div",{style:{fontSize:9,color:MT}},new Date(d+"T12:00:00").toLocaleDateString("en-AU",{month:"short"}))); }))),React.createElement("tbody",null,HRS.map(function(h){ return React.createElement("tr",{key:h},React.createElement("td",{style:{position:"sticky",left:0,zIndex:4,background:"#fff",borderRight:"1px solid "+LN,borderBottom:"1px solid #F8FAFC",padding:"0 6px 0 8px",width:62,minWidth:62,whiteSpace:"nowrap"}},React.createElement("span",{style:{fontSize:10,color:MT,fontWeight:700}},fmtT(h))),wk.map(function(d){ var bk=isBk(d,h),bl=isBl(d,h),sl=isSl(d,h),ps=isPst(d,h),un=bk||bl||ps; return React.createElement("td",{key:d,style:{padding:2,borderBottom:"1px solid #F8FAFC",borderLeft:"1px solid #F8FAFC",height:46,width:54}},React.createElement("button",{className:"slb",onClick:function(){ tog(d,h); },disabled:un,style:{width:"100%",height:"100%",minHeight:42,borderRadius:8,border:sl?"2px solid "+GR:"none",cursor:un?"default":"pointer",background:sl?"#D1FAE5":bk?"#FEF3C7":bl?"#FEE2E2":ps?"#F8FAFC":"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}},sl?React.createElement("span",{style:{color:GR,fontWeight:900}},"v"):bk?React.createElement("span",{style:{fontSize:10,color:"#B45309"}},"o"):bl?React.createElement("span",null,"X"):ps?null:React.createElement("span",{style:{color:"#93C5FD",fontSize:18}},"+"))); })); })))),React.createElement("div",{style:{padding:"12px 16px",background:OF}},slots.length>0?React.createElement(Crd,{style:{margin:0,border:"2px solid "+B}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},React.createElement("span",{style:{fontWeight:800,fontSize:15,color:NV}},slots.length+" lesson"+(slots.length>1?"s":"")+" selected"),React.createElement("span",{style:{fontSize:12,color:SL}},dur+" min each")),React.createElement("div",{style:{maxHeight:100,overflowY:"auto",marginBottom:12}},[...slots].sort(function(a,b){ return a.date.localeCompare(b.date)||a.hour-b.hour; }).map(function(s){ return React.createElement("div",{key:s.date+s.hour,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid "+LN}},React.createElement("span",{style:{fontSize:13,color:NV,fontWeight:600}},new Date(s.date+"T12:00:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"})+" at "+fmtT(s.hour)),React.createElement("button",{onClick:function(){ setSlots(function(p){ return p.filter(function(x){ return !(x.date===s.date&&x.hour===s.hour); }); }); },style:{background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 7px",cursor:"pointer"}},React.createElement(Ico,{n:"x",sz:12,c:RD}))); })),React.createElement("div",{style:{display:"flex",gap:8}},React.createElement(Btn,{onClick:function(){ setStep(1); },v:"outline"},"Back"),React.createElement(Btn,{onClick:function(){ setStep(3); },full:true},"Review Booking"))):React.createElement(Btn,{onClick:function(){ setStep(1); },v:"outline",full:true},"Back to Details")));
  if(step===3) return React.createElement("div",null,React.createElement(Hdr),React.createElement("div",{style:{padding:16},className:"wrap"},React.createElement(Crd,{style:{margin:0}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV,marginBottom:16}},"Confirm Booking"),React.createElement("div",{style:{background:OF,borderRadius:14,padding:16,marginBottom:14}},React.createElement("div",{style:{display:"flex",gap:10,marginBottom:12}},React.createElement("div",{style:{width:40,height:40,borderRadius:10,background:B+"20",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement(Ico,{n:"user",sz:18,c:B})),React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:15,color:NV}},form.name),React.createElement("div",{style:{fontSize:12,color:SL}},form.email))),React.createElement("div",{style:{height:1,background:LN,marginBottom:12}}),React.createElement("div",{style:{fontWeight:700,fontSize:13,color:NV,marginBottom:8}},slots.length+" Lesson"+(slots.length>1?"s":"")), [...slots].sort(function(a,b){ return a.date.localeCompare(b.date); }).map(function(s){ return React.createElement("div",{key:s.date+s.hour,style:{fontSize:13,color:SL,paddingBottom:4}},fmtD(s.date)+" at "+fmtT(s.hour)+" ("+s.dur+" min)"); })),React.createElement("div",{style:{background:"#FEF3C7",borderRadius:12,padding:12,marginBottom:16,fontSize:13,color:"#92400E"}},"Confirmation will be sent to "+form.email),React.createElement("div",{style:{display:"flex",gap:8}},React.createElement(Btn,{onClick:function(){ setStep(2); },v:"outline"},"Back"),React.createElement(Btn,{onClick:confirm,v:"green",full:true,disabled:submitting},submitting?"Processing...":"Confirm All")))));
  return React.createElement("div",null,React.createElement(Hdr),React.createElement("div",{style:{padding:16},className:"wrap"},React.createElement(Crd,{style:{margin:0,textAlign:"center",padding:32}},React.createElement("div",{style:{fontSize:60,marginBottom:16}},"\uD83C\uDF89"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:NV,marginBottom:8}},"You are Booked!"),React.createElement("div",{style:{fontSize:14,color:SL,marginBottom:24,lineHeight:1.6}},slots.length+" lesson"+(slots.length>1?"s":"")+" confirmed for "+form.name+"."),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},React.createElement(Btn,{onClick:function(){ setStep(1); setForm({name:"",email:"",phone:"",notes:""}); setSlots([]); setSubmitting(false); },full:true},"Book More"),React.createElement(Btn,{onClick:function(){ go("mybookings"); },v:"outline",full:true},"View My Bookings")))));
}

function MyBksPage(props) {
  var bks=props.bks,setBksRaw=props.setBksRaw;
  var r1=useState(""); var email=r1[0]; var setEmail=r1[1];
  var r2=useState(false); var searched=r2[0]; var setSearched=r2[1];
  var mine=searched?bks.filter(function(b){ return b.sEmail.toLowerCase()===email.toLowerCase(); }).sort(function(a,b){ return a.date.localeCompare(b.date)||a.hour-b.hour; }):[];
  var upcoming=mine.filter(function(b){ return b.date>=tod()&&b.status!=="cancelled"; });
  var past=mine.filter(function(b){ return b.date<tod()||b.status==="cancelled"; });
  async function cancel(id){ await sbUpdate("bookings",id,{status:"cancelled"}); setBksRaw(bks.map(function(b){ return b.id===id?Object.assign({},b,{status:"cancelled"}):b; })); }
  function BCard(cp) {
    var b=cp.b;
    return React.createElement("div",{style:{background:"#fff",borderRadius:16,padding:16,marginBottom:10,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",borderLeft:"4px solid "+(b.status==="exam"?GD:b.status==="cancelled"?LN:b.date<tod()?LN:GR)}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},
        React.createElement("div",null,b.status==="exam"&&React.createElement("div",{style:{fontSize:14,marginBottom:2,fontWeight:700,color:GD}},"Test Day!"),React.createElement("div",{style:{fontWeight:800,fontSize:15,color:NV}},fmtD(b.date)),React.createElement("div",{style:{fontSize:13,color:SL,marginTop:2}},fmtT(b.hour)+" - "+b.dur+" min")),
        React.createElement("span",{style:{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:b.status==="cancelled"?"#F1F5F9":b.status==="exam"?"#FEF3C7":b.date<tod()?"#F1F5F9":"#D1FAE5",color:b.status==="cancelled"?MT:b.status==="exam"?"#92400E":b.date<tod()?MT:"#065F46"}},b.status==="cancelled"?"Cancelled":b.status==="exam"?"Test Day":b.date<tod()?"Completed":"Confirmed")
      ),
      b.date>=tod()&&b.status!=="cancelled"&&React.createElement("button",{onClick:function(){ cancel(b.id); },style:{marginTop:10,padding:"7px 14px",background:"#FEE2E2",border:"none",borderRadius:8,fontSize:12,fontWeight:700,color:RD,cursor:"pointer"}},"Cancel")
    );
  }
  return React.createElement("div",null,
    React.createElement(PH,{title:"My Bookings",sub:"View and manage your lessons"}),
    React.createElement("div",{style:{padding:"0 16px 24px",background:"linear-gradient(160deg,"+NV+","+BL+")"}},
      React.createElement("div",{className:"wrap",style:{display:"flex",gap:8}},
        React.createElement("input",{className:"si",style:{flex:1,padding:"11px 14px",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontSize:14,outline:"none",background:"rgba(255,255,255,0.12)",color:"#fff"},placeholder:"Enter your email...",value:email,onChange:function(e){ setEmail(e.target.value); },onKeyDown:function(e){ if(e.key==="Enter") setSearched(true); }}),
        React.createElement("button",{onClick:function(){ setSearched(true); },style:{padding:"11px 16px",background:GD,border:"none",borderRadius:12,fontWeight:800,color:NV,cursor:"pointer"}},"Find")
      )
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      searched&&mine.length===0&&React.createElement(Crd,null,React.createElement("div",{style:{textAlign:"center",padding:16}},React.createElement("div",{style:{fontSize:36,marginBottom:8}},"\uD83D\uDCED"),React.createElement("div",{style:{fontWeight:700,color:NV}},"No bookings found"))),
      upcoming.length>0&&React.createElement(React.Fragment,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV,marginBottom:10}},"Upcoming ("+upcoming.length+")"),upcoming.map(function(b){ return React.createElement(BCard,{key:b.id,b:b}); })),
      past.length>0&&React.createElement(React.Fragment,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:MT,margin:"16px 0 10px"}},"Past and Cancelled"),past.map(function(b){ return React.createElement(BCard,{key:b.id,b:b}); }))
    )
  );
}

function ProgPage(props) {
  var stus=props.stus,bks=props.bks;
  var r1=useState(""); var email=r1[0]; var setEmail=r1[1];
  var r2=useState(false); var searched=r2[0]; var setSearched=r2[1];
  var st=searched?stus.find(function(s){ return s.email.toLowerCase()===email.toLowerCase(); }):null;
  var myB=st?bks.filter(function(b){ return b.sEmail.toLowerCase()===st.email.toLowerCase(); }):[];
  var done=Object.values(st?st.progress:{}).filter(Boolean).length;
  var pct=st?Math.round(done/TOPICS.length*100):0;
  return React.createElement("div",null,
    React.createElement(PH,{title:"My Progress",sub:"Track your learning journey"}),
    React.createElement("div",{style:{padding:"0 16px 24px",background:"linear-gradient(160deg,"+NV+","+BL+")"}},
      React.createElement("div",{className:"wrap",style:{display:"flex",gap:8}},
        React.createElement("input",{className:"si",style:{flex:1,padding:"11px 14px",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontSize:14,outline:"none",background:"rgba(255,255,255,0.12)",color:"#fff"},placeholder:"Enter your email...",value:email,onChange:function(e){ setEmail(e.target.value); },onKeyDown:function(e){ if(e.key==="Enter") setSearched(true); }}),
        React.createElement("button",{onClick:function(){ setSearched(true); },style:{padding:"11px 16px",background:GD,border:"none",borderRadius:12,fontWeight:800,color:NV,cursor:"pointer"}},"Find")
      )
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      searched&&!st&&React.createElement(Crd,null,React.createElement("div",{style:{textAlign:"center"}},React.createElement("div",{style:{fontSize:36}},"\uD83D\uDD0D"),React.createElement("div",{style:{fontWeight:700,color:NV,marginTop:8}},"Not found"))),
      st&&React.createElement(React.Fragment,null,
        st.examReady&&!st.examResult&&React.createElement("div",{style:{background:"linear-gradient(135deg,"+GD+","+AM+")",borderRadius:20,padding:20,marginBottom:12,color:NV}},React.createElement("div",{style:{fontSize:26,marginBottom:4}},"\uD83C\uDFC6"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"You are Exam Ready!"),React.createElement("div",{style:{fontSize:13,marginTop:4,opacity:0.8}},"Your instructor has approved you for the test."+(st.examDate?" Test: "+fmtD(st.examDate):""))),
        st.examResult==="pass"&&React.createElement("div",{style:{background:"linear-gradient(135deg,"+GR+",#059669)",borderRadius:20,padding:20,marginBottom:12,color:"#fff"}},React.createElement("div",{style:{fontSize:26}},"\uD83C\uDF89"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginTop:4}},"Test Passed!")),
        React.createElement(Crd,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV}},"Hi "+st.name.split(" ")[0]+"!"),React.createElement("div",{style:{fontSize:12,color:MT,marginBottom:16}},"Since "+fmtD(st.enrolled)),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}},[["Lessons",myB.filter(function(b){ return b.date<tod()&&b.status!=="cancelled"; }).length,B],["Topics",done+"/"+TOPICS.length,GR]].map(function(row){ return React.createElement("div",{key:row[0],style:{background:OF,borderRadius:12,padding:14,textAlign:"center"}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:row[2]}},row[1]),React.createElement("div",{style:{fontSize:11,color:MT}},row[0])); })),React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},React.createElement("span",{style:{fontSize:13,fontWeight:700,color:NV}},"Progress"),React.createElement("span",{style:{fontSize:13,fontWeight:800,color:B}},pct+"%")),React.createElement("div",{style:{background:LN,borderRadius:20,height:12,overflow:"hidden"}},React.createElement("div",{style:{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+B+","+SK+")",borderRadius:20,transition:"width 1s ease"}}))),
        React.createElement(Crd,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV,marginBottom:12}},"Learning Topics"),React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},TOPICS.map(function(t){ return React.createElement("span",{key:t,style:{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,background:st.progress[t]?"#D1FAE5":"#F1F5F9",color:st.progress[t]?"#065F46":SL}},(st.progress[t]?"v ":"o ")+t); })))
      )
    )
  );
}

function RevPage(props) {
  var tests=props.tests;
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 28px",color:"#fff"}},
      React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12,marginBottom:16}},React.createElement(Logo,{size:38}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Reviews"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},"What our students say"))),
      React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:16}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:52,fontWeight:800,color:"#fff",lineHeight:1}},"5.0"),React.createElement("div",null,React.createElement("div",{style:{color:GD,fontSize:24}},"\u2605\u2605\u2605\u2605\u2605"),React.createElement("a",{href:"https://www.google.com/maps/place/Steer+Assist+Driving+School/@-38.0698958,145.4580482,17z",target:"_blank",rel:"noopener noreferrer",style:{fontSize:12,opacity:0.7,marginTop:4,color:"#fff",textDecoration:"underline"}},"1,014 Google Reviews")))
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV,marginBottom:12}},"Student Testimonials"),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}},
        tests.map(function(t){ return React.createElement("div",{key:t.id,style:{background:"#fff",borderRadius:16,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}},React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}},React.createElement("div",{style:{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,"+B+","+NV+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13,flexShrink:0}},t.name[0]),React.createElement("div",{style:{fontSize:12,fontWeight:700,color:NV}},t.name)),React.createElement(Stars,{n:t.stars,size:12}),React.createElement("p",{style:{fontSize:12,color:SL,lineHeight:1.5,fontStyle:"italic",marginTop:6}},'"'+(t.text.length>80?t.text.slice(0,80)+"...":t.text)+'"')); })
      ),
      React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV,marginBottom:12}},"Google Reviews"),
      React.createElement(ElfsightWidget,null),
      React.createElement("div",{style:{display:"flex",gap:8,marginTop:16}},
        React.createElement(SBtn,{href:IG},React.createElement(IgIco,{sz:15})," Instagram"),
        React.createElement(SBtn,{href:FB},React.createElement(FbIco,{sz:15})," Facebook"),
        React.createElement(SBtn,{href:WA},React.createElement(WaIco,{sz:15})," WhatsApp"),
        React.createElement(SBtn,{href:GGL},React.createElement(GgIco,{sz:15})," Google")
      )
    )
  );
}

function ContactPage(props) {
  var go=props.go;
  var r1=useState({name:"",email:"",phone:"",type:"Pricing Enquiry",message:""}); var form=r1[0]; var setForm=r1[1];
  var r2=useState("idle"); var status=r2[0]; var setStatus=r2[1];
  var TYPES=["Pricing Enquiry","Lesson Availability","Test Preparation","Gift a Lesson","Intensive Course","General Question"];
  async function send(){ if(!form.name||!form.email||!form.message){setStatus("error");return;} setStatus("sending"); try{ await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS_SVC,template_id:EJS_TPL,user_id:EJS_KEY,template_params:{from_name:form.name,from_email:form.email,phone:form.phone,enquiry_type:form.type,message:form.message,to_email:EMAIL}})}); setStatus("sent"); }catch(e){ setStatus("error"); } }
  if(status==="sent") return React.createElement("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:OF}},React.createElement(Crd,{style:{textAlign:"center",padding:36,maxWidth:500,margin:"0 auto"}},React.createElement("div",{style:{fontSize:60,marginBottom:16}},"\u2705"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:NV,marginBottom:8}},"Message Sent!"),React.createElement("div",{style:{fontSize:14,color:SL,lineHeight:1.6,marginBottom:24}},"Thanks "+form.name+"! We will get back to you shortly."),React.createElement(Btn,{onClick:function(){ go("home"); },full:true},"Back to Home")));
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 28px",color:"#fff",position:"relative",overflow:"hidden"}},
      React.createElement("div",{style:{position:"absolute",bottom:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}),
      React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12,marginBottom:20}},React.createElement(Logo,{size:38}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Get in Touch"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},"We will get back to you ASAP"))),
      React.createElement("div",{className:"wrap",style:{display:"flex",gap:10}},
        React.createElement("a",{href:"tel:"+PHONE,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"11px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:13}},React.createElement(Ico,{n:"phone",sz:15,c:"#fff"})," Call Us"),
        React.createElement("a",{href:"mailto:"+EMAIL,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"11px",background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:13}},React.createElement(Ico,{n:"mail",sz:15,c:"#fff"})," Email Us")
      )
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      React.createElement(Crd,{style:{margin:0}},
        React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:NV,marginBottom:4}},"Send us a Message"),
        React.createElement("div",{style:{fontSize:13,color:SL,marginBottom:20}},"We will respond within 24 hours"),
        [["name","Your Name","text","John Smith"],["email","Email","email","john@example.com"],["phone","Phone","tel","0412 345 678"]].map(function(row){ var k=row[0],label=row[1],type=row[2],ph=row[3]; return React.createElement("div",{key:k,style:{marginBottom:14}},React.createElement(Lbl,null,label),React.createElement(Inp,{value:form[k],onChange:function(e){ setForm(Object.assign({},form,{[k]:e.target.value})); },placeholder:ph,type:type})); }),
        React.createElement("div",{style:{marginBottom:14}},React.createElement(Lbl,null,"Enquiry Type"),React.createElement("select",{className:"si",style:{width:"100%",padding:"12px 14px",border:"2px solid "+LN,borderRadius:12,fontSize:14,outline:"none",boxSizing:"border-box",background:"#F8FAFC",color:NV,cursor:"pointer"},value:form.type,onChange:function(e){ setForm(Object.assign({},form,{type:e.target.value})); }},TYPES.map(function(t){ return React.createElement("option",{key:t},t); }))),
        React.createElement("div",{style:{marginBottom:20}},React.createElement(Lbl,null,"Your Message"),React.createElement(Inp,{value:form.message,onChange:function(e){ setForm(Object.assign({},form,{message:e.target.value})); },placeholder:"Tell us what you need...",multi:true})),
        status==="error"&&React.createElement("div",{style:{background:"#FEE2E2",borderRadius:10,padding:10,marginBottom:12,fontSize:13,color:RD}},"Please fill in your name, email and message."),
        React.createElement(Btn,{onClick:send,full:true,v:status==="sending"?"outline":"primary"},status==="sending"?"Sending...":"Send Message")
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}},
        [["tel:"+PHONE,"phone",GR,"Call Us",PHONED],["mailto:"+EMAIL,"mail",B,"Email Us","info@steerassist"]].map(function(row){ return React.createElement("a",{key:row[1],href:row[0],style:{display:"flex",flexDirection:"column",alignItems:"center",padding:16,background:"#fff",borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",textDecoration:"none",gap:6}},React.createElement("div",{style:{width:40,height:40,borderRadius:12,background:row[2]+"15",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement(Ico,{n:row[1],sz:20,c:row[2]})),React.createElement("div",{style:{fontSize:11,color:MT,fontWeight:600}},row[3]),React.createElement("div",{style:{fontSize:12,fontWeight:800,color:NV,textAlign:"center"}},row[4])); })
      )
    )
  );
}

function FaqPage() {
  var r=useState(null); var open=r[0]; var setOpen=r[1];
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 28px",color:"#fff",position:"relative",overflow:"hidden"}},
      React.createElement("div",{style:{position:"absolute",bottom:-60,right:-30,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}),
      React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12,marginBottom:16}},React.createElement(Logo,{size:38}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"FAQs"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},"Frequently asked questions"))),
      React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"10px 16px"}},React.createElement(Ico,{n:"qm",sz:20,c:GD}),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,0.85)",lineHeight:1.5}},"Can not find your answer? ",React.createElement("a",{href:"tel:"+PHONE,style:{color:GD,fontWeight:700,textDecoration:"none"}},"Call us free")))
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      FAQS.map(function(f,i){ return React.createElement("div",{key:i,style:{background:"#fff",borderRadius:16,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:open===i?"2px solid "+B:"2px solid transparent",transition:"border 0.2s"}},React.createElement("button",{onClick:function(){ setOpen(open===i?null:i); },style:{width:"100%",padding:"16px 18px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}},React.createElement("span",{style:{fontWeight:700,fontSize:14,color:NV,textAlign:"left",lineHeight:1.4}},f.q),React.createElement("div",{style:{width:28,height:28,borderRadius:"50%",background:open===i?B+"15":"#F4F7FB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},React.createElement(Ico,{n:open===i?"cU":"cD",sz:14,c:open===i?B:MT}))),React.createElement("div",{className:"faqb",style:{maxHeight:open===i?400:0,opacity:open===i?1:0}},React.createElement("div",{style:{padding:"0 18px 16px",fontSize:13,color:SL,lineHeight:1.7,borderTop:"1px solid "+LN}},React.createElement("div",{style:{height:12}}),f.a))); }),
      React.createElement("div",{style:{background:"linear-gradient(135deg,"+NV+","+BL+")",borderRadius:20,padding:20,marginTop:8,textAlign:"center"}},React.createElement("div",{style:{fontSize:24,marginBottom:8}},"\uD83D\uDCDE"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,color:"#fff",marginBottom:4}},"Still have questions?"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,0.7)",marginBottom:16}},"Call us for free advice - no obligation"),React.createElement("a",{href:"tel:"+PHONE,style:{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",background:"linear-gradient(135deg,"+GD+","+AM+")",borderRadius:14,textDecoration:"none",fontWeight:800,fontSize:15,color:NV}},React.createElement(Ico,{n:"phone",sz:16,c:NV})," ",PHONED))
    )
  );
}

function LoginPage(props) {
  var setIsInst=props.setIsInst,go=props.go;
  var r1=useState(""); var pw=r1[0]; var setPw=r1[1];
  var r2=useState(""); var err=r2[0]; var setErr=r2[1];
  function login(){ if(pw===PASS){setIsInst(true);go("dashboard");}else setErr("Incorrect password."); }
  return React.createElement("div",{style:{minHeight:"100vh",background:OF,display:"flex",flexDirection:"column"}},
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"40px 20px 60px",textAlign:"center",color:"#fff"}},React.createElement("div",{style:{display:"flex",justifyContent:"center"}},React.createElement(Logo,{size:60})),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,marginTop:12}},"Instructor Portal"),React.createElement("div",{style:{fontSize:13,opacity:0.65,marginTop:4}},"Enter your password to continue")),
    React.createElement("div",{style:{flex:1,padding:"0 16px",marginTop:-24,maxWidth:480,margin:"-24px auto 0",width:"100%"}},React.createElement(Crd,null,React.createElement("div",{style:{width:56,height:56,borderRadius:16,background:B+"15",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}},React.createElement(Ico,{n:"lock",sz:26,c:B})),React.createElement(Lbl,null,"Password"),React.createElement("input",{className:"si",style:{width:"100%",padding:"13px 16px",border:"2px solid "+(err?RD:LN),borderRadius:12,fontSize:15,outline:"none",boxSizing:"border-box",marginBottom:6},type:"password",placeholder:"Enter password",value:pw,onChange:function(e){setPw(e.target.value);setErr("");},onKeyDown:function(e){if(e.key==="Enter")login();}}),err&&React.createElement("div",{style:{fontSize:13,color:RD,marginBottom:8}},err),React.createElement(Btn,{onClick:login,full:true},"Login to Portal")))
  );
}

function DashPage(props) {
  var bks=props.bks,stus=props.stus,go=props.go;
  var r0=useState("today"); var activeTab=r0[0]; var setActiveTab=r0[1];
  var todayB=bks.filter(function(b){ return b.date===tod()&&b.status!=="cancelled"; }).sort(function(a,b){ return a.hour-b.hour; });
  var upcomingB=bks.filter(function(b){ return b.date>tod()&&b.status!=="cancelled"; }).sort(function(a,b){ return a.date.localeCompare(b.date)||a.hour-b.hour; });
  var examsB=bks.filter(function(b){ return b.status==="exam"&&b.date>=tod(); }).sort(function(a,b){ return a.date.localeCompare(b.date); });
  var upcoming=upcomingB.length;
  var exams=examsB;
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 24px",color:"#fff"}},React.createElement("div",{className:"wrap",style:{display:"flex",alignItems:"center",gap:12}},React.createElement(Logo,{size:42}),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Dashboard"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},new Date().toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"}))))),
    React.createElement("div",{style:{padding:"16px 16px 0"},className:"wrap"},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:16}},
        [["Today",todayB.length,B,"cal","diary"],["Upcoming",upcoming,SK,"award","upcoming"],["Students",stus.length,GR,"user","students"],["Exams",exams.length,GD,"trophy","exams"]].map(function(row){ return React.createElement("div",{key:row[0],onClick:function(){ row[4]==="students"?go("students"):setActiveTab(row[4]); },style:{background:"#fff",borderRadius:16,padding:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",cursor:"pointer",border:activeTab===row[4]?"2px solid "+row[2]:"2px solid transparent"}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:800,color:row[2]}},row[1]),React.createElement("div",{style:{width:36,height:36,borderRadius:10,background:row[2]+"15",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement(Ico,{n:row[3],sz:18,c:row[2]}))),React.createElement("div",{style:{fontSize:12,color:MT,marginTop:4,fontWeight:600}},row[0])); })
      ),
      exams.length>0&&React.createElement("div",{style:{background:"linear-gradient(135deg,"+GD+","+AM+")",borderRadius:16,padding:16,marginBottom:16,color:NV}},React.createElement("div",{style:{fontWeight:800,fontSize:14,marginBottom:8}},"Upcoming Test Days"),exams.map(function(b){ return React.createElement("div",{key:b.id,style:{fontSize:13,marginBottom:3}},b.sName+" - "+fmtD(b.date)+" at "+fmtT(b.hour)); })),
      React.createElement(Crd,null,
  React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV,marginBottom:12}},activeTab==="today"?"Today":activeTab==="upcoming"?"Upcoming Lessons":"Upcoming Exams"),
  (activeTab==="today"?todayB:activeTab==="upcoming"?upcomingB:examsB).length===0?
    React.createElement("div",{style:{color:MT,fontSize:14,textAlign:"center",padding:"16px 0"}},activeTab==="today"?"No lessons today":"None"):
    (activeTab==="today"?todayB:activeTab==="upcoming"?upcomingB:examsB).map(function(b){ return React.createElement("div",{key:b.id,style:{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+LN}},React.createElement("div",{style:{width:48,textAlign:"center",background:b.status==="exam"?"#FEF3C7":"#EFF6FF",borderRadius:10,padding:"6px 4px"}},React.createElement("div",{style:{fontWeight:800,fontSize:15,color:b.status==="exam"?GD:B}},fmtT(b.hour).split(" ")[0]),React.createElement("div",{style:{fontSize:9,color:MT}},fmtT(b.hour).split(" ")[1])),React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:14,color:NV}},(b.status==="exam"?"Test - ":"")+b.sName),React.createElement("div",{style:{fontSize:12,color:MT}},activeTab==="today"?b.dur+" min":fmtD(b.date)+" - "+b.dur+" min"))); })
),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:16}},[["diary","Diary","cal"],["students","Students","user"],["achieve","Achievements","trophy"],["diary","Export CSV","dl"]].map(function(row){ return React.createElement("button",{key:row[1],onClick:function(){ go(row[0]); },style:{display:"flex",alignItems:"center",gap:8,padding:14,background:"#fff",border:"2px solid "+LN,borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:13,color:NV}},React.createElement(Ico,{n:row[2],sz:18,c:B})," "+row[1]); }))
    )
  );
}

function DiaryPage(props) {
  var bks=props.bks,setBksRaw=props.setBksRaw,blkd=props.blkd,setBlkd=props.setBlkd;
  var r1=useState(tod()); var anchor=r1[0]; var setAnchor=r1[1];
  var r2=useState(tod()); var selDate=r2[0]; var setSelDate=r2[1];
  var r3=useState(null); var modal=r3[0]; var setModal=r3[1];
  var r4=useState(""); var reason=r4[0]; var setReason=r4[1];
  var r5=useState(""); var expMsg=r5[0]; var setExpMsg=r5[1];
  var wk=wkOf(anchor);
  function dayB(d){ return bks.filter(function(b){ return b.date===d&&b.status!=="cancelled"; }).sort(function(a,b){ return a.hour-b.hour; }); }
  function isBlkd(d,h){ return blkd.some(function(b){ return b.date===d&&(b.allDay||(h!==null&&b.hour===h)); }); }
  function rmBlk(id){ setBlkd(blkd.filter(function(b){ return b.id!==id; })); }
  function saveBlk(allDay,h){ setBlkd([...blkd,{id:uid(),date:modal.date,hour:allDay?null:h,allDay:allDay,reason:reason}]); setModal(null); setReason(""); }
  async function upSt(id,status){ await sbUpdate("bookings",id,{status:status}); setBksRaw(bks.map(function(b){ return b.id===id?Object.assign({},b,{status:status}):b; })); }
  function expCSV(){ var rows=[["Date","Time","Student","Email","Phone","Duration","Status","Notes"]]; bks.forEach(function(b){ rows.push([b.date,fmtT(b.hour),b.sName,b.sEmail,b.sPhone,b.dur+" min",b.status,b.notes]); }); var blob=new Blob([rows.map(function(r){ return r.map(function(c){ return '"'+c+'"'; }).join(","); }).join("\n")],{type:"text/csv"}); var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="steer-assist-bookings.csv"; a.click(); setExpMsg("Exported!"); setTimeout(function(){ setExpMsg(""); },2000); }
  var db=dayB(selDate);
  var dayBl=blkd.filter(function(b){ return b.date===selDate; });
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"16px 20px",color:"#fff"}},React.createElement("div",{className:"wrap",style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Diary"),React.createElement("button",{onClick:expCSV,style:{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"linear-gradient(135deg,"+GD+","+AM+")",border:"none",borderRadius:10,fontWeight:700,fontSize:12,color:NV,cursor:"pointer"}},React.createElement(Ico,{n:"dl",sz:13,c:NV}),expMsg||"Export CSV"))),
    React.createElement("div",{style:{background:"#fff",padding:"12px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}},
      React.createElement("div",{className:"wrap",style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},React.createElement("button",{onClick:function(){ setAnchor(addD(wk[0],-7)); },style:{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}},React.createElement(Ico,{n:"cL",sz:15,c:SL})),React.createElement("span",{style:{fontWeight:700,fontSize:13,color:NV}},new Date(wk[0]+"T12:00:00").toLocaleDateString("en-AU",{month:"short",day:"numeric"})+" - "+new Date(wk[6]+"T12:00:00").toLocaleDateString("en-AU",{month:"short",day:"numeric"})),React.createElement("button",{onClick:function(){ setAnchor(addD(wk[0],7)); },style:{background:"#F1F5F9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer"}},React.createElement(Ico,{n:"cR",sz:15,c:SL}))),
      React.createElement("div",{className:"wrap",style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}},wk.map(function(d,i){ var isT=d===tod(),isSel=d===selDate,cnt=dayB(d).length,blkd2=isBlkd(d,null); return React.createElement("button",{key:d,onClick:function(){ setSelDate(d); },style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 2px",borderRadius:10,border:"none",cursor:"pointer",background:isSel?B:blkd2?"#FEE2E2":isT?"#EFF6FF":"#F8FAFC"}},React.createElement("span",{style:{fontSize:10,fontWeight:700,color:isSel?"#fff":MT}},DNAMES[i]),React.createElement("span",{style:{fontSize:16,fontWeight:800,color:isSel?"#fff":isT?B:NV}},new Date(d+"T12:00:00").getDate()),cnt>0&&React.createElement("span",{style:{width:6,height:6,borderRadius:"50%",background:isSel?"#fff":GR,marginTop:1}})); }))
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      React.createElement(Crd,null,
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV}},fmtD(selDate)),React.createElement("div",{style:{fontSize:12,color:MT}},db.length+" lesson"+(db.length!==1?"s":""))),React.createElement("button",{onClick:function(){ setModal({date:selDate,allDay:true}); },style:{padding:"7px 12px",background:"#FEE2E2",border:"none",borderRadius:10,fontWeight:700,fontSize:12,color:RD,cursor:"pointer"}},"Block Day")),
        dayBl.length>0&&React.createElement("div",{style:{background:"#FEE2E2",borderRadius:10,padding:10,marginBottom:12}},dayBl.map(function(bl){ return React.createElement("div",{key:bl.id,style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}},React.createElement("span",{style:{fontSize:13,color:RD,fontWeight:600}},"Blocked - "+(bl.allDay?"Full day":fmtT(bl.hour))+" - "+(bl.reason||"Blocked")),React.createElement("button",{onClick:function(){ rmBlk(bl.id); },style:{background:"none",border:"none",cursor:"pointer",color:RD,fontSize:12}},"Remove")); })),
        HRS.map(function(h){ var bk=db.find(function(b){ return b.hour===h; }); var bl=blkd.find(function(b){ return b.date===selDate&&!b.allDay&&b.hour===h; }); return React.createElement("div",{key:h,style:{display:"flex",alignItems:"center",gap:10,minHeight:50,borderBottom:"1px solid #F8FAFC"}},React.createElement("div",{style:{width:56,fontSize:11,color:MT,fontWeight:700,flexShrink:0}},fmtT(h)),bk?React.createElement("div",{style:{flex:1,background:bk.status==="exam"?"#FEF3C7":"#EFF6FF",borderRadius:10,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:14,color:NV}},(bk.status==="exam"?"Test - ":"")+bk.sName),React.createElement("div",{style:{fontSize:11,color:MT}},bk.dur+" min")),React.createElement("div",{style:{display:"flex",gap:6}},bk.status!=="exam"&&React.createElement("button",{onClick:function(){ upSt(bk.id,"exam"); },style:{background:GD,border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:NV,fontWeight:700}},"Set Exam"),React.createElement("button",{onClick:async function(){ await sbUpdate("bookings",bk.id,{status:"cancelled"}); setBksRaw(bks.map(function(b){ return b.id===bk.id?Object.assign({},b,{status:"cancelled"}):b; })); },style:{background:"#FEE2E2",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer"}},React.createElement(Ico,{n:"x",sz:12,c:RD})))):bl?React.createElement("div",{style:{flex:1,background:"#FEE2E2",borderRadius:10,padding:"6px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("span",{style:{fontSize:13,color:RD}},"Blocked - "+(bl.reason||"Blocked")),React.createElement("button",{onClick:function(){ rmBlk(bl.id); },style:{background:"none",border:"none",cursor:"pointer",color:RD,fontSize:12}},"Remove")):React.createElement("button",{onClick:function(){ setModal({date:selDate,hour:h}); },style:{flex:1,background:"none",border:"1.5px dashed "+LN,borderRadius:10,padding:"8px 12px",cursor:"pointer",color:MT,fontSize:12,textAlign:"left"}},"+ Block this slot")); })
      )
    ),
    modal&&React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:function(){ setModal(null); }},React.createElement("div",{onClick:function(e){ e.stopPropagation(); },style:{background:"#fff",borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:480}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,color:NV,marginBottom:4}},modal.allDay?"Block Full Day":"Block "+fmtT(modal.hour)),React.createElement("div",{style:{fontSize:13,color:MT,marginBottom:16}},fmtD(modal.date)),React.createElement(Lbl,null,"Reason (optional)"),React.createElement("input",{className:"si",style:{width:"100%",padding:"12px 14px",border:"2px solid "+LN,borderRadius:12,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:16},placeholder:"e.g. Holiday, Lunch...",value:reason,onChange:function(e){ setReason(e.target.value); }}),React.createElement("div",{style:{display:"flex",gap:10}},React.createElement(Btn,{onClick:function(){ setModal(null); },v:"outline"},"Cancel"),React.createElement(Btn,{onClick:function(){ saveBlk(!!modal.allDay,modal.hour); },v:"red",full:true},"Block"))))
  );
}

function StusPage(props) {
  var stus=props.stus,setStus=props.setStus,bks=props.bks;
  var r1=useState(""); var search=r1[0]; var setSearch=r1[1];
  var r2=useState("all"); var filter=r2[0]; var setFilter=r2[1];
  var r3=useState(null); var sel=r3[0]; var setSel=r3[1];
  var r4=useState(false); var editP=r4[0]; var setEditP=r4[1];
  function getLessons(id){ return bks.filter(function(b){ return b.sid===id&&b.status!=="cancelled"; }).length; }
  function getPct(st){ return Math.round(Object.values(st.progress).filter(Boolean).length/TOPICS.length*100); }
  function upProg(id,t,v){ setStus(stus.map(function(s){ return s.id===id?Object.assign({},s,{progress:Object.assign({},s.progress,{[t]:v})}):s; })); if(sel&&sel.id===id) setSel(function(p){ return Object.assign({},p,{progress:Object.assign({},p.progress,{[t]:v})}); }); }
  function setER(id,v){ setStus(stus.map(function(s){ return s.id===id?Object.assign({},s,{examReady:v}):s; })); if(sel&&sel.id===id) setSel(function(p){ return Object.assign({},p,{examReady:v}); }); }
  function setERes(id,res){ setStus(stus.map(function(s){ return s.id===id?Object.assign({},s,{examResult:res}):s; })); if(sel&&sel.id===id) setSel(function(p){ return Object.assign({},p,{examResult:res}); }); }
  var filtered=stus.filter(function(s){ var ms=s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase()); if(filter==="exam-ready") return ms&&s.examReady&&!s.examResult; if(filter==="passed") return ms&&s.examResult==="pass"; if(filter==="in-progress") return ms&&!s.examReady; return ms; });   async function deleteStu(s){ if(!window.confirm("Delete "+s.name+" and all their bookings? This cannot be undone.")) return; var stuBks=bks.filter(function(b){ return b.sid===s.id; }); for(var i=0;i<stuBks.length;i++){ await sbDelete("bookings",stuBks[i].id); } await sbDelete("students",s.id); setStus(stus.filter(function(x){ return x.id!==s.id; })); }
  if(sel){
    var s=stus.find(function(x){ return x.id===sel.id; })||sel;
    var pct=getPct(s);
    var upcoming=bks.filter(function(b){ return b.sid===s.id&&b.date>=tod()&&b.status!=="cancelled"; }).sort(function(a,b){ return a.date.localeCompare(b.date); });
    return React.createElement("div",null,
      React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"16px 20px 24px",color:"#fff"}},React.createElement("button",{onClick:function(){ setSel(null); setEditP(false); },style:{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,marginBottom:12}},"Back"),React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800}},s.name),React.createElement("div",{style:{fontSize:12,opacity:0.7,marginTop:2}},s.email)),
      React.createElement("div",{style:{padding:16},className:"wrap"},
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}},[["Lessons",getLessons(s.id),B],["Done",bks.filter(function(b){ return b.sid===s.id&&b.date<tod()&&b.status!=="cancelled"; }).length,GR],["Progress",pct+"%",GD]].map(function(row){ return React.createElement("div",{key:row[0],style:{background:"#fff",borderRadius:14,padding:14,textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:row[2]}},row[1]),React.createElement("div",{style:{fontSize:11,color:MT}},row[0])); })),
        React.createElement(Crd,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV,marginBottom:12}},"Exam Status"),s.examResult?React.createElement("div",{style:{background:s.examResult==="pass"?"#D1FAE5":"#FEE2E2",borderRadius:12,padding:12}},React.createElement("div",{style:{fontWeight:800,color:s.examResult==="pass"?"#065F46":RD,fontSize:16}},s.examResult==="pass"?"PASSED!":"Did not pass")):!s.examReady?React.createElement(Btn,{onClick:function(){ setER(s.id,true); },v:"gold",sm:true},"Mark Exam Ready"):React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},React.createElement("span",{style:{background:"#FEF3C7",borderRadius:20,padding:"5px 14px",fontSize:13,fontWeight:800,color:"#92400E"}},"Exam Ready"),React.createElement(Btn,{onClick:function(){ setERes(s.id,"pass"); },v:"green",sm:true},"Passed"),React.createElement(Btn,{onClick:function(){ setERes(s.id,"fail"); },v:"red",sm:true},"Failed"),React.createElement(Btn,{onClick:function(){ setER(s.id,false); },v:"outline",sm:true},"Remove"))),
        React.createElement(Crd,null,React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV}},"Topics ("+Object.values(s.progress).filter(Boolean).length+"/"+TOPICS.length+")"),React.createElement("button",{onClick:function(){ setEditP(!editP); },style:{padding:"6px 12px",background:editP?"#D1FAE5":"#F4F7FB",border:"none",borderRadius:8,fontWeight:700,fontSize:12,color:editP?GR:B,cursor:"pointer"}},editP?"Done":"Edit")),React.createElement("div",{style:{background:LN,borderRadius:20,height:10,marginBottom:14,overflow:"hidden"}},React.createElement("div",{style:{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+B+","+SK+")",borderRadius:20}})),TOPICS.map(function(t){ return React.createElement("div",{key:t,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F8FAFC"}},React.createElement("span",{style:{fontSize:13,color:s.progress[t]?"#065F46":SL,fontWeight:s.progress[t]?700:400}},(s.progress[t]?"v ":"o ")+t),editP&&React.createElement("button",{onClick:function(){ upProg(s.id,t,!s.progress[t]); },style:{background:s.progress[t]?"#D1FAE5":"#EFF6FF",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12,fontWeight:700,color:s.progress[t]?GR:B}},s.progress[t]?"Done":"Mark")); })),
        upcoming.length>0&&React.createElement(Crd,null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,color:NV,marginBottom:10}},"Upcoming"),upcoming.map(function(b){ return React.createElement("div",{key:b.id,style:{display:"flex",gap:12,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F8FAFC"}},React.createElement("div",{style:{background:b.status==="exam"?"#FEF3C7":"#EFF6FF",borderRadius:10,padding:"6px 10px",textAlign:"center",minWidth:48}},React.createElement("div",{style:{fontWeight:800,fontSize:14,color:b.status==="exam"?GD:B}},new Date(b.date+"T12:00:00").getDate()),React.createElement("div",{style:{fontSize:10,color:MT}},new Date(b.date+"T12:00:00").toLocaleDateString("en-AU",{month:"short"}))),React.createElement("div",null,React.createElement("div",{style:{fontWeight:600,fontSize:14,color:NV}},fmtT(b.hour)+(b.status==="exam"?" - TEST":"")),React.createElement("div",{style:{fontSize:12,color:MT}},b.dur+" min"))); }))
      )
    );
  }
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 20px",color:"#fff"}},React.createElement("div",{className:"wrap"},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:2}},"Students"),React.createElement("div",{style:{fontSize:11,opacity:0.65,marginBottom:14}},stus.length+" enrolled"),React.createElement("input",{className:"si",style:{width:"100%",padding:"11px 14px",border:"1.5px solid rgba(255,255,255,0.3)",borderRadius:12,fontSize:14,outline:"none",background:"rgba(255,255,255,0.12)",color:"#fff",boxSizing:"border-box"},placeholder:"Search...",value:search,onChange:function(e){ setSearch(e.target.value); }}))),
    React.createElement("div",{style:{display:"flex",gap:6,padding:"12px 16px 0",overflowX:"auto"},className:"wrap"},[["all","All"],["in-progress","In Progress"],["exam-ready","Exam Ready"],["passed","Passed"]].map(function(row){ return React.createElement("button",{key:row[0],onClick:function(){ setFilter(row[0]); },style:{padding:"7px 14px",borderRadius:20,border:"2px solid "+(filter===row[0]?B:LN),background:filter===row[0]?"#EFF6FF":"#fff",color:filter===row[0]?B:SL,fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}},row[1]); })),
    React.createElement("div",{style:{padding:"12px 16px 0",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10},className:"wrap"},
      filtered.map(function(s){ return React.createElement("div",{key:s.id,style:{background:"#fff",borderRadius:16,padding:16,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:12,position:"relative"}}, React.createElement("div",{onClick:function(){ setSel(s); },style:{display:"flex",alignItems:"center",gap:12,flex:1,cursor:"pointer"}},React.createElement("div",{style:{width:46,height:46,borderRadius:"50%",background:"linear-gradient(135deg,"+B+","+NV+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:18,flexShrink:0}},s.name[0]),React.createElement("div",{style:{flex:1,minWidth:0}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",{style:{fontWeight:700,fontSize:15,color:NV}},s.name),React.createElement("div",null,s.examReady&&!s.examResult&&React.createElement("span",null,"\uD83C\uDFC6"),s.examResult==="pass"&&React.createElement("span",null,"\u2705"))),React.createElement("div",{style:{fontSize:12,color:MT,marginBottom:5}},getLessons(s.id)+" lessons"),React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6}},React.createElement("div",{style:{flex:1,background:LN,borderRadius:10,height:6,overflow:"hidden"}},React.createElement("div",{style:{height:"100%",width:getPct(s)+"%",background:"linear-gradient(90deg,"+B+","+SK+")",borderRadius:10}})),React.createElement("span",{style:{fontSize:11,fontWeight:700,color:B}},getPct(s)+"%")))), React.createElement("button",{onClick:async function(e){ e.stopPropagation(); if(!window.confirm("Delete "+s.name+" and all their bookings? This cannot be undone.")) return; var stuBks=bks.filter(function(b){ return b.sid===s.id; }); for(var i=0;i<stuBks.length;i++){ await sbDelete("bookings",stuBks[i].id); } await sbDelete("students",s.id); setStus(stus.filter(function(x){ return x.id!==s.id; })); },style:{background:"#FEE2E2",border:"none",borderRadius:8,padding:"8px 10px",cursor:"pointer",flexShrink:0,marginLeft:"auto"}},React.createElement(Ico,{n:"trash",sz:14,c:RD}))); })
    )
  );
}

function AchvPage(props) {
  var tests=props.tests,setTests=props.setTests;
  var r1=useState(false); var showForm=r1[0]; var setShowForm=r1[1];
  var r2=useState({name:"",text:"",stars:5,date:tod()}); var form=r2[0]; var setForm=r2[1];
  var r3=useState("google"); var tab=r3[0]; var setTab=r3[1];
  function add(){ if(!form.name||!form.text) return; setTests([Object.assign({id:uid()},form),...tests]); setForm({name:"",text:"",stars:5,date:tod()}); setShowForm(false); }
  return React.createElement("div",null,
    React.createElement("div",{style:{background:"linear-gradient(160deg,"+NV+","+BL+")",padding:"20px 20px 24px",color:"#fff"}},React.createElement("div",{className:"wrap",style:{display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}},"Achievements"),React.createElement("div",{style:{fontSize:11,opacity:0.65}},"Manage testimonials")),React.createElement("button",{onClick:function(){ setShowForm(!showForm); },style:{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"linear-gradient(135deg,"+GD+","+AM+")",border:"none",borderRadius:10,fontWeight:700,fontSize:12,color:NV,cursor:"pointer"}},React.createElement(Ico,{n:"plus",sz:13,c:NV})," Add"))),
    React.createElement("div",{style:{display:"flex",gap:6,padding:"12px 16px 0",borderBottom:"1px solid "+LN,background:"#fff"},className:"wrap"},
      [["google","Google Reviews"],["testimonials","Testimonials"]].map(function(row){ return React.createElement("button",{key:row[0],onClick:function(){ setTab(row[0]); },style:{padding:"10px 20px",borderRadius:"10px 10px 0 0",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:tab===row[0]?B:"transparent",color:tab===row[0]?"#fff":SL}},row[1]); })
    ),
    React.createElement("div",{style:{padding:16},className:"wrap"},
      tab==="google"&&React.createElement("div",{style:{marginTop:8}},
        React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV,marginBottom:16}},"Live Google Reviews"),
        React.createElement(ElfsightWidget,null)
      ),
      tab==="testimonials"&&React.createElement("div",null,
        showForm&&React.createElement(Crd,{style:{marginBottom:14}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:NV,marginBottom:14}},"New Testimonial"),[["name","Student Name","John Smith"],["text","Testimonial","What did they say?"]].map(function(row){ var k=row[0],l=row[1],ph=row[2]; return React.createElement("div",{key:k,style:{marginBottom:12}},React.createElement(Lbl,null,l),React.createElement(Inp,{value:form[k],onChange:function(e){ setForm(Object.assign({},form,{[k]:e.target.value})); },placeholder:ph,multi:k==="text"})); }),React.createElement("div",{style:{marginBottom:14}},React.createElement(Lbl,null,"Stars"),React.createElement("div",{style:{display:"flex",gap:6}},[1,2,3,4,5].map(function(n){ return React.createElement("button",{key:n,onClick:function(){ setForm(Object.assign({},form,{stars:n})); },style:{fontSize:26,background:"none",border:"none",cursor:"pointer",opacity:n<=form.stars?1:0.25,color:GD,padding:2}},"\u2605"); }))),React.createElement(Btn,{onClick:add,v:"green",full:true},"Save")),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},[[tests.length,"Testimonials",GD],[GREV.length,"Google Reviews","#4285F4"]].map(function(row){ return React.createElement("div",{key:row[1],style:{background:"#fff",borderRadius:14,padding:14,textAlign:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}},React.createElement("div",{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:24,fontWeight:800,color:row[2]}},row[0]),React.createElement("div",{style:{fontSize:12,color:MT}},row[1])); })),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}},
          tests.map(function(t){ return React.createElement(Crd,{key:t.id,style:{margin:0}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}},React.createElement("div",{style:{display:"flex",gap:10,flex:1}},React.createElement("div",{style:{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,"+B+","+NV+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15,flexShrink:0}},t.name[0]),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontWeight:700,fontSize:14,color:NV}},t.name),React.createElement(Stars,{n:t.stars,size:13}),React.createElement("p",{style:{fontSize:12,color:SL,marginTop:5,fontStyle:"italic",lineHeight:1.5}},'"'+t.text+'"'),React.createElement("div",{style:{fontSize:10,color:MT,marginTop:4}},t.date))),React.createElement("button",{onClick:function(){ setTests(tests.filter(function(x){ return x.id!==t.id; })); },style:{background:"#FEE2E2",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",marginLeft:8}},React.createElement(Ico,{n:"trash",sz:13,c:RD})))); })
        )
      )
    )
  );
}
