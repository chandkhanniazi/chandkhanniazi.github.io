/* CHAND KHAN NIAZI — live transformation log
   Data source: Google Sheet published as CSV (SHEET_CSV below).
   If empty or unreachable, falls back to the inline DATA snapshot. */
var SHEET_CSV = ""; /* paste published-CSV link here */

var DATA = [
[1,90.0,21.5,70.7,"Cut begins — 500 kcal deficit"],
[2,88.8,20.8,70.4,""],[3,88.6,20.3,70.6,""],[4,87.8,19.8,70.4,""],
[5,86.7,19.8,69.5,""],[6,87.4,19.3,70.6,""],[7,86.8,19.3,70.1,""],
[8,86.6,18.5,70.6,""],[9,85.3,17.8,70.1,""],[10,85.5,17.5,70.5,""],
[11,85.0,17.1,70.5,""],[12,84.5,17.0,70.1,""],
[13,83.6,15.6,70.5,"1000 kcal deficit"],
[14,83.0,14.6,70.9,""],[15,82.1,13.8,70.8,""],[16,81.5,13.0,70.9,""],
[17,80.5,11.6,71.2,""],[18,80.2,11.6,70.9,"Refeed days"],
[19,79.5,10.6,71.1,"Back to 500 deficit"],
[20,79.35,10.3,71.2,""],[21,78.7,10.0,70.8,""],[22,78.45,9.66,70.9,""],
[23,78.5,9.0,71.4,""],[24,78.15,9.3,70.9,"Refeed days"],
[25,77.85,9.6,70.4,""],[26,76.9,8.6,70.7,"Cut complete"],
[27,77.1,8.6,null,"Maintenance week"],
[28,77.4,8.6,null,"Bulk started — 700 kcal surplus"],
[29,77.8,8.6,null,""],[30,78.2,8.6,null,""],
[31,78.2,8.6,null,"Carbohydrates increased — 45% to 56%"],
[32,78.5,8.6,null,""],[33,78.7,8.3,null,""],
[34,79.1,8.6,null,"Surplus ~1030"],[35,79.3,8.6,null,"Surplus ~1086"],
[36,80.4,8.6,null,""],[37,80.2,8.6,null,"Surplus reduced to ~886"],
[38,80.7,8.8,null,"Surplus ~500"],[39,80.5,8.6,null,""],
[40,80.98,8.6,null,""],[41,80.53,8.3,null,""],
[42,80.63,8.6,null,""],[43,80.51,8.3,null,""],
[44,80.4,8.6,null,""],
[45,80.25,8.6,null,""],[46,81.1,8.6,null,""],[47,81.03,8.6,null,""],
[48,81.18,8.6,null,""],[49,80.98,8.6,null,"Surplus ~900"],
[50,81.45,8.6,null,"Surplus ~700"],[51,82.13,8.6,null,"Surplus ~500"],
[52,81.76,null,null,"Surplus ~357"],[53,81.88,null,null,"Surplus ~500"],
[54,82.61,null,null,""],
[55,83.0,null,null,""],[56,83.5,null,null,""],
[57,82.0,null,null,"Previous surplus became maintenance — another 500 added"]
];

(function(){
  var chartEl=document.getElementById("log-chart"),
      tableEl=document.getElementById("log-table");
  if(!chartEl && !tableEl) return;

  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");}

  function parseCSV(t){
    var rows=[],row=[],cur="",q=false;
    for(var i=0;i<t.length;i++){var c=t[i];
      if(q){ if(c=='"'){ if(t[i+1]=='"'){cur+='"';i++;} else q=false; } else cur+=c; }
      else{ if(c=='"') q=true;
        else if(c==",") {row.push(cur);cur="";}
        else if(c=="\n"||c=="\r"){ if(cur!==""||row.length){row.push(cur);rows.push(row);row=[];cur="";} }
        else cur+=c; } }
    if(cur!==""||row.length){row.push(cur);rows.push(row);}
    return rows;
  }

  function norm(arr){
    var out=[];
    for(var i=0;i<arr.length;i++){var r=arr[i];
      var w=parseFloat(r[1]);
      if(!isFinite(w)) continue; /* skips header row */
      var bf=(r[2]===""||r[2]==null)?null:parseFloat(r[2]);
      out.push({week:parseInt(r[0],10)||out.length+1, w:w,
                bf:isFinite(bf)?bf:null,
                lbm:(r[3]===""||r[3]==null)?null:r[3],
                note:r[4]||""});
    }
    return out;
  }

  function ticks(lo,hi){
    var out=[],seen={};
    for(var k=0;k<4;k++){var v=Math.round(lo+(hi-lo)*k/3);
      if(!seen[v]){seen[v]=1;out.push(v);}}
    return out;
  }

  function render(rows){
    var n=rows.length; if(!n) return;
    var L=46,R=754,T=20,B=316;
    function X(i){return L+(n===1?0:i*(R-L)/(n-1));}
    var ws=rows.map(function(r){return r.w;});
    var wlo=Math.floor(Math.min.apply(null,ws))-1,
        whi=Math.ceil(Math.max.apply(null,ws))+1;
    function Yw(v){return B-(v-wlo)/(whi-wlo)*(B-T);}
    var bfp=[]; rows.forEach(function(r,i){ if(r.bf!=null) bfp.push([i,r.bf]); });
    var g="";
    ticks(wlo,whi).forEach(function(t){var y=Yw(t);
      g+='<line x1="'+L+'" y1="'+y.toFixed(1)+'" x2="'+R+'" y2="'+y.toFixed(1)+'" stroke="rgba(147,160,180,.14)" stroke-width="1"/>';
      g+='<text x="'+(L-8)+'" y="'+(y+4).toFixed(1)+'" text-anchor="end" fill="#93A0B4" font-size="11" font-family="Figtree,sans-serif">'+t+'</text>';});
    var blo,bhi,Yb=null;
    if(bfp.length){
      var bs=bfp.map(function(p){return p[1];});
      blo=Math.floor(Math.min.apply(null,bs))-1;
      bhi=Math.ceil(Math.max.apply(null,bs))+1;
      Yb=function(v){return B-(v-blo)/(bhi-blo)*(B-T);};
      ticks(blo,bhi).forEach(function(t){
        g+='<text x="'+(R+8)+'" y="'+(Yb(t)+4).toFixed(1)+'" text-anchor="start" fill="#93A0B4" font-size="11" font-family="Figtree,sans-serif">'+t+'%</text>';});
    }
    var xt=""; var marks=[1]; for(var m=10;m<n;m+=10) marks.push(m); marks.push(n);
    marks.forEach(function(wk){
      xt+='<text x="'+X(wk-1).toFixed(1)+'" y="'+(B+22)+'" text-anchor="middle" fill="#93A0B4" font-size="11" font-family="Figtree,sans-serif">'+wk+'</text>';});
    var div="";
    for(var i2=0;i2<n;i2++){ if(rows[i2].note.indexOf("Bulk started")===0){
      var bx=X(i2);
      div='<line x1="'+bx.toFixed(1)+'" y1="'+T+'" x2="'+bx.toFixed(1)+'" y2="'+B+'" stroke="#C6A15B" stroke-width="1" stroke-dasharray="4 5" opacity=".6"/>'
        +'<text x="'+(bx-8).toFixed(1)+'" y="'+(T+14)+'" text-anchor="end" fill="#C6A15B" font-size="11" font-family="Figtree,sans-serif" letter-spacing="2">CUT</text>'
        +'<text x="'+(bx+8).toFixed(1)+'" y="'+(T+14)+'" text-anchor="start" fill="#C6A15B" font-size="11" font-family="Figtree,sans-serif" letter-spacing="2">BULK</text>';
      break; } }
    var pw=rows.map(function(r,i){return X(i).toFixed(1)+","+Yw(r.w).toFixed(1);}).join(" ");
    var pb=Yb?bfp.map(function(p){return X(p[0]).toFixed(1)+","+Yb(p[1]).toFixed(1);}).join(" "):"";
    var last=rows[n-1], lastBf=bfp.length?bfp[bfp.length-1]:null;
    var svg='<div class="legend"><span><i style="background:#C6A15B"></i>Body weight (kg)</span>'
      +(Yb?'<span><i style="background:#D7DEE9"></i>Body fat (%)</span>':'')+'</div>'
      +'<svg viewBox="0 0 800 360" role="img" aria-label="Weekly body weight and body fat chart" style="width:100%;height:auto;">'
      +g+xt+div
      +(pb?'<polyline points="'+pb+'" fill="none" stroke="#D7DEE9" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity=".85"/>':'')
      +'<polyline points="'+pw+'" fill="none" stroke="#C6A15B" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>'
      +'<circle cx="'+X(n-1).toFixed(1)+'" cy="'+Yw(last.w).toFixed(1)+'" r="4" fill="#E6CD92"/>'
      +'<text x="'+(X(n-1)-8).toFixed(1)+'" y="'+(Yw(last.w)-10).toFixed(1)+'" text-anchor="end" fill="#E6CD92" font-size="12" font-weight="600" font-family="Figtree,sans-serif">'+last.w+' kg</text>'
      +(lastBf?'<circle cx="'+X(lastBf[0]).toFixed(1)+'" cy="'+Yb(lastBf[1]).toFixed(1)+'" r="3.4" fill="#D7DEE9"/><text x="'+(X(lastBf[0])-8).toFixed(1)+'" y="'+(Yb(lastBf[1])+18).toFixed(1)+'" text-anchor="end" fill="#D7DEE9" font-size="12" font-weight="600" font-family="Figtree,sans-serif">'+lastBf[1]+'%</text>':'')
      +'</svg>'
      +'<figcaption>Weeks 1–'+n+', measured every Wednesday since 1 June 2025. Left axis: weight (kg). Right axis: body fat (%).</figcaption>';
    if(chartEl) chartEl.innerHTML=svg;
    if(tableEl){
      var h='<table class="logtable"><thead><tr><th>Week</th><th>Weight (kg)</th><th>Body fat</th><th>LBM (kg)</th><th>Note</th></tr></thead><tbody>';
      rows.forEach(function(r){
        h+='<tr><td>'+r.week+'</td><td>'+r.w+'</td><td>'+(r.bf!=null?r.bf+'%':'—')+'</td><td>'+(r.lbm!=null?esc(r.lbm):'—')+'</td><td class="note">'+esc(r.note)+'</td></tr>';});
      tableEl.innerHTML=h+'</tbody></table>';
    }
  }

  var fallback=norm(DATA);
  if(SHEET_CSV){
    fetch(SHEET_CSV).then(function(r){return r.text();}).then(function(t){
      var rows=norm(parseCSV(t));
      render(rows.length?rows:fallback);
    }).catch(function(){render(fallback);});
  } else { render(fallback); }
})();
