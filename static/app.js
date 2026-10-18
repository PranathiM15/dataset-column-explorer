const $ = id => document.getElementById(id);
let mode = 'loc', currentDataset = 'iris.csv', lastResult = null, columns = [];
function escapeHtml(value){return String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderTable(target, cols, rows){
  const table=$(target);
  if(!cols.length){table.innerHTML='<tbody><tr><td>No columns selected.</td></tr></tbody>';return;}
  table.innerHTML='<thead><tr>'+cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')+'</tr></thead><tbody>'+(rows.length?rows.map(row=>'<tr>'+cols.map(c=>`<td>${escapeHtml(row[c])}</td>`).join('')+'</tr>').join(''):'<tr><td colspan="'+cols.length+'">No rows in this range.</td></tr>')+'</tbody>';
}
function selectedColumns(){return [...document.querySelectorAll('#columnChoices input:checked')].map(el=>el.value)}
async function loadDataset(name){
 currentDataset=name; $('error').textContent=''; $('resultArea').hidden=true; $('resultEmpty').hidden=false;
 try{const r=await fetch('/api/dataset?name='+encodeURIComponent(name));const data=await r.json();if(!r.ok)throw Error(data.error);
 columns=data.columns;$('statName').textContent=data.name;$('statCols').textContent=columns.length;$('statRows').textContent=data.rows;$('previewMeta').textContent=`${data.rows} rows · ${columns.length} columns`;
 $('columnChoices').innerHTML=columns.map((c,i)=>`<label class="column-option"><input type="checkbox" value="${escapeHtml(c)}" checked><span>${escapeHtml(c)}</span></label>`).join('');renderTable('previewTable',columns,data.preview);
 $('rowEnd').max=Math.max(0,data.rows-1);if(Number($('rowEnd').value)>=data.rows)$('rowEnd').value=Math.min(4,data.rows-1);
 }catch(e){$('error').textContent=e.message;}}
document.querySelectorAll('.mode').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.mode').forEach(b=>b.classList.remove('active'));btn.classList.add('active');mode=btn.dataset.mode;$('endHint').textContent=mode==='loc'?'(inclusive)':'(inclusive here)';}));
$('dataset').addEventListener('change',e=>loadDataset(e.target.value));
$('selectAll').addEventListener('click',()=>{const boxes=[...document.querySelectorAll('#columnChoices input')],all=boxes.every(b=>b.checked);boxes.forEach(b=>b.checked=!all);$('selectAll').textContent=all?'Select all':'Clear all';});
$('csvFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;$('uploadName').textContent=file.name;const form=new FormData();form.append('file',file);try{const r=await fetch('/api/upload',{method:'POST',body:form});const d=await r.json();if(!r.ok)throw Error(d.error);let option=[...$('dataset').options].find(o=>o.value===d.name);if(!option){option=new Option(d.name,d.name);$('dataset').add(option)}$('dataset').value=d.name;await loadDataset(d.name)}catch(err){$('error').textContent=err.message}});
$('runBtn').addEventListener('click',async()=>{ $('error').textContent='';const start=$('rowStart').value,end=$('rowEnd').value,cols=selectedColumns();if(!cols.length){$('error').textContent='Select at least one column to continue.';return}if(start===''||end===''||Number(start)<0||Number(end)<Number(start)){$('error').textContent='Enter a valid row range. Start must be less than or equal to end.';return}
 $('runBtn').disabled=true;$('runBtn').firstChild.textContent=' Running…';try{const r=await fetch('/api/select',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({dataset:currentDataset,mode,start,end,columns:cols})});const d=await r.json();if(!r.ok)throw Error(d.error);lastResult=d;$('resultEmpty').hidden=true;$('resultArea').hidden=false;$('resultCount').textContent=`${d.count} ROWS`; $('codeOutput').textContent=d.explanation;renderTable('resultTable',d.columns,d.rows);$('resultMeta').textContent=`${d.count} selected row${d.count===1?'':'s'} · ${d.columns.length} selected column${d.columns.length===1?'':'s'}`;}catch(e){$('error').textContent=e.message}finally{$('runBtn').disabled=false;$('runBtn').firstChild.textContent='▶ Run selection';}});
$('copyCode').addEventListener('click',async()=>{if(!lastResult)return;try{await navigator.clipboard.writeText(lastResult.explanation);$('copyCode').textContent='Copied!';setTimeout(()=>$('copyCode').textContent='Copy',1200)}catch{$('copyCode').textContent='Select text'}});
$('downloadCsv').addEventListener('click',()=>{if(!lastResult)return;const cols=lastResult.columns;const csv=[cols,...lastResult.rows.map(r=>cols.map(c=>r[c]??''))].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.download='selected-data.csv';a.click();URL.revokeObjectURL(a.href)});
loadDataset($('dataset').value||'iris.csv');
