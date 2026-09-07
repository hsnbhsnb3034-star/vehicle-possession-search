const DATA_FILE="data.json";
const form=document.getElementById("searchForm");
const input=document.getElementById("searchInput");
const statusBox=document.getElementById("status");
const resultsBox=document.getElementById("results");
let records=[];

function normalize(v){
  return String(v??"").trim().toUpperCase().replace(/\s+/g,"");
}

function search(){
  const query=normalize(input.value);
  resultsBox.innerHTML="";
  if(!query){statusBox.textContent="اكتب رقم الحيازة أولاً.";return;}
  const matches=records.filter(r=>normalize(r.code).endsWith(query));
  statusBox.textContent=`نتيجة البحث: ${query}`;
  if(!matches.length){
    resultsBox.innerHTML='<div class="empty">لا توجد حيازة مطابقة.</div>';
    return;
  }
  matches.forEach(r=>{
    const box=document.createElement("div"); box.className="result";
    const title=document.createElement("div"); title.className="title"; title.textContent="حيازة السيارة";
    const code=document.createElement("div"); code.className="code"; code.textContent=r.code;
    box.append(title,code);
    if(r.url){
      const actions=document.createElement("div"); actions.className="actions";
      const view=document.createElement("a"); view.className="action view"; view.href=r.url; view.target="_blank"; view.rel="noopener noreferrer"; view.textContent="👁️ عرض الحيازة";
      const save=document.createElement("a"); save.className="action save"; save.href=r.url; save.target="_blank"; save.rel="noopener noreferrer"; save.textContent="⬇️ فتح / حفظ";
      actions.append(view,save); box.appendChild(actions);
    }
    resultsBox.appendChild(box);
  });
}

form.addEventListener("submit",e=>{e.preventDefault();search();});
fetch(DATA_FILE,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(d=>{
  records=Array.isArray(d)?d:[];
  statusBox.textContent=`جاهز — ${records.length} حيازات للتجربة`;
}).catch(()=>{statusBox.textContent="تعذر تحميل بيانات الحيازات.";});
