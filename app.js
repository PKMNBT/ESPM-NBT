(() => {
  "use strict";
  const STORAGE_KEY = "epusbonat-static-v1";
  const indicators = [
    "Pelayanan kesehatan ibu hamil",
    "Pelayanan kesehatan ibu bersalin",
    "Pelayanan kesehatan bayi baru lahir",
    "Pelayanan kesehatan balita",
    "Pelayanan kesehatan pada usia pendidikan dasar",
    "Pelayanan kesehatan pada usia produktif",
    "Pelayanan kesehatan pada usia lanjut",
    "Pelayanan kesehatan penderita hipertensi",
    "Pelayanan kesehatan penderita diabetes melitus",
    "Pelayanan kesehatan orang dengan gangguan jiwa (ODGJ) berat",
    "Pelayanan kesehatan orang terduga tuberkulosis (TB)",
    "Pelayanan kesehatan orang dengan risiko terinfeksi HIV"
  ];
  const clusters = [
    {id:"01",title:"Manajemen",symbol:"⌘",description:"Pengelolaan organisasi, tata kelola, mutu, dan dukungan operasional Puskesmas.",services:["Manajemen Puskesmas","Manajemen sumber daya","Mutu dan keselamatan pasien","Sistem informasi dan pencatatan","Jejaring dan pemberdayaan masyarakat"]},
    {id:"02",title:"Ibu & Anak",symbol:"♡",description:"Layanan kesehatan sepanjang siklus hidup ibu, bayi, balita, anak, dan remaja.",services:["Kesehatan ibu dan kehamilan","Kesehatan ibu bersalin dan nifas","Kesehatan bayi dan balita","Kesehatan anak usia sekolah","Kesehatan remaja dan calon pengantin"]},
    {id:"03",title:"Dewasa & Lansia",symbol:"♧",description:"Pelayanan kesehatan usia dewasa dan lanjut usia, termasuk penyakit tidak menular dan kesehatan jiwa sesuai alur layanan.",services:["Skrining kesehatan usia produktif","Pelayanan kesehatan lanjut usia","Pencegahan dan pengendalian PTM","Pelayanan kesehatan jiwa","Konseling dan tindak lanjut"]},
    {id:"04",title:"P2M & Kesling",symbol:"✳",description:"Upaya pencegahan penyakit menular dan pengelolaan kesehatan lingkungan.",services:["Surveilans penyakit","Pencegahan dan pengendalian penyakit menular","Pelayanan TB dan HIV","Imunisasi dan kewaspadaan dini","Kesehatan lingkungan dan sanitasi"]},
    {id:"05",title:"Lintas Klaster",symbol:"⇄",description:"Layanan pendukung dan kolaborasi lintas program untuk kesinambungan pelayanan.",services:["Pelayanan farmasi","Pelayanan laboratorium","Gizi dan konseling","Promosi kesehatan","Koordinasi rujukan dan tindak lanjut"]}
  ];

  const $ = (id) => document.getElementById(id);
  let toastTimer;
  let state = loadState();
  let activeCluster = null;

  function blankRecords() {
    return indicators.map((name, i) => ({id:String(i+1), indicator:i, target:0, achieved:0, notes:"", updatedAt:""}));
  }
  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (parsed && Array.isArray(parsed.records) && parsed.records.length === 12) return parsed;
    } catch (_) {}
    return {records:blankRecords()};
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (_) {
      showToast("Penyimpanan browser penuh atau tidak tersedia.");
      return false;
    }
  }
  function formatNumber(value) {
    return Number(value || 0).toLocaleString("id-ID");
  }
  function percent(record) {
    return Number(record.target) > 0 ? Math.min(100, (Number(record.achieved) / Number(record.target)) * 100) : 0;
  }
  function exactPercent(record) {
    return Number(record.target) > 0 ? (Number(record.achieved) / Number(record.target)) * 100 : 0;
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function showPage(page) {
    document.querySelectorAll(".page-view").forEach(el => el.classList.toggle("active", el.id === `page-${page}`));
    document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.page === page));
    const names = {dashboard:"Dashboard",spm:"SPM",klaster:"Klaster Pelayanan"};
    $("breadcrumbCurrent").textContent = names[page] || "Dashboard";
    document.title = `${names[page] || "Dashboard"} | E-PUSBONAT`;
    $("sidebar").classList.remove("open");
    if (page === "dashboard") renderDashboard();
    if (page === "spm") renderSpm();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderDashboard() {
    const totalTarget = state.records.reduce((sum,r)=>sum+Number(r.target||0),0);
    const totalAchieved = state.records.reduce((sum,r)=>sum+Number(r.achieved||0),0);
    $("statIndicators").textContent = indicators.length;
    $("statTarget").textContent = formatNumber(totalTarget);
    $("statAchieved").textContent = formatNumber(totalAchieved);
    $("statPercent").innerHTML = `${totalTarget ? (totalAchieved/totalTarget*100).toLocaleString("id-ID",{maximumFractionDigits:1}) : "0"}<span class="value-unit">%</span>`;
    const sorted = state.records.map((r,i)=>({...r,indicator:i})).filter(r=>Number(r.target)>0||Number(r.achieved)>0).slice(0,6);
    $("dashboardSpmRows").innerHTML = sorted.map(r => {
      const p = exactPercent(r);
      return `<tr><td><div class="indicator-cell"><span class="indicator-number">${String(r.indicator+1).padStart(2,"0")}</span><span class="indicator-name">${escapeHtml(indicators[r.indicator])}</span></div></td><td class="number-cell">${formatNumber(r.target)}</td><td class="number-cell">${formatNumber(r.achieved)}</td><td class="progress-cell"><div class="progress-label"><span>Progres</span><strong>${p.toLocaleString("id-ID",{maximumFractionDigits:1})}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${percent(r)}%"></div></div></td></tr>`;
    }).join("");
    $("dashboardEmpty").hidden = sorted.length > 0;
  }
  function renderSpm() {
    const query = $("spmSearch").value.trim().toLocaleLowerCase("id");
    const filter = $("spmFilter").value;
    const visible = state.records.map((r,i)=>({...r,indicator:i})).filter(r => {
      const entered = Number(r.target)>0 || Number(r.achieved)>0 || Boolean(r.notes);
      return indicators[r.indicator].toLocaleLowerCase("id").includes(query) &&
        (filter === "all" || (filter === "entered" ? entered : !entered));
    });
    $("spmRows").innerHTML = visible.map(r => {
      const p = exactPercent(r);
      const entered = Number(r.target)>0 || Number(r.achieved)>0 || Boolean(r.notes);
      return `<tr>
        <td><span class="indicator-number">${String(r.indicator+1).padStart(2,"0")}</span></td>
        <td><div class="indicator-name">${escapeHtml(indicators[r.indicator])}</div>${r.notes ? `<div style="font-size:9px;color:#91a3a4;margin-top:5px;white-space:normal">${escapeHtml(r.notes)}</div>` : ""}</td>
        <td class="number-cell">${formatNumber(r.target)}</td><td class="number-cell">${formatNumber(r.achieved)}</td>
        <td><span class="percent-pill ${entered?"":"zero"}">${p.toLocaleString("id-ID",{maximumFractionDigits:1})}%</span></td>
        <td><span class="data-status ${entered?"filled":""}">${entered?"Sudah diisi":"Belum diisi"}</span></td>
        <td><div class="row-actions"><button class="icon-btn" data-edit="${r.indicator}" aria-label="Edit ${escapeHtml(indicators[r.indicator])}">✎ Edit</button></div></td>
      </tr>`;
    }).join("");
    $("spmCount").textContent = `${visible.length} dari ${indicators.length} indikator`;
    if (!visible.length) $("spmRows").innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#8ba0a2">Tidak ada indikator yang cocok dengan pencarian.</td></tr>';
  }
  function renderClusters() {
    $("clusterGrid").innerHTML = clusters.map(c => `<button class="cluster-card ${activeCluster===c.id?"selected":""}" data-cluster="${c.id}"><div class="cluster-card-top"><span class="cluster-number">KLASTER ${c.id}</span><span class="cluster-symbol">${c.symbol}</span></div><h3>${c.title}</h3><p>${c.description}</p><span class="card-arrow">↗</span></button>`).join("");
    if (activeCluster) renderClusterDetail(activeCluster);
  }
  function renderClusterDetail(id) {
    const cluster = clusters.find(c=>c.id===id);
    if (!cluster) return;
    activeCluster = id;
    $("clusterDetailTitle").textContent = `Klaster ${cluster.id} · ${cluster.title}`;
    $("clusterDetailDescription").textContent = cluster.description;
    $("clusterDetailBody").innerHTML = `<div class="service-list">${cluster.services.map((service,i)=>`<div class="service-item"><span class="service-check">${String(i+1).padStart(2,"0")}</span><span>${escapeHtml(service)}</span></div>`).join("")}</div>`;
    document.querySelectorAll(".cluster-card").forEach(el=>el.classList.toggle("selected",el.dataset.cluster===id));
  }
  function openModal(index = null) {
    $("spmForm").reset();
    $("formIndicator").innerHTML = indicators.map((name,i)=>`<option value="${i}">${String(i+1).padStart(2,"0")} · ${escapeHtml(name)}</option>`).join("");
    $("formId").value = index === null ? "" : String(index);
    $("modalTitle").textContent = index === null ? "Tambah Data SPM" : "Edit Data SPM";
    if (index !== null) {
      const record = state.records[index];
      $("formIndicator").value = String(index);
      $("formTarget").value = record.target;
      $("formAchieved").value = record.achieved;
      $("formNotes").value = record.notes || "";
    }
    $("spmModal").classList.add("open");
    $("spmModal").setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
    $("formIndicator").focus();
  }
  function closeModal() {
    $("spmModal").classList.remove("open");
    $("spmModal").setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  function downloadFile(name, content, type) {
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  function exportJson() {
    const payload = {app:"E-PUSBONAT",version:1,exportedAt:new Date().toISOString(),records:state.records};
    downloadFile("epusbonat-cadangan.json",JSON.stringify(payload,null,2),"application/json");
    showToast("Cadangan JSON berhasil disiapkan.");
  }
  function exportCsv() {
    const rows = [["No","Indikator","Sasaran","Capaian","Persentase","Catatan"]];
    state.records.forEach((r,i)=>rows.push([i+1,indicators[i],r.target,r.achieved,exactPercent(r).toFixed(1),r.notes||""]));
    const csv = rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    downloadFile("epusbonat-spm.csv","\uFEFF"+csv,"text/csv;charset=utf-8");
    showToast("File CSV berhasil disiapkan.");
  }
  function importJsonFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const records = Array.isArray(parsed) ? parsed : parsed.records;
        if (!Array.isArray(records) || records.length !== 12) throw new Error("Format");
        const normalized = indicators.map((_,i) => {
          const found = records.find(r=>Number(r.indicator)===i) || records[i];
          const target = Number(found?.target ?? 0), achieved = Number(found?.achieved ?? 0);
          if (!Number.isFinite(target)||!Number.isFinite(achieved)||target<0||achieved<0) throw new Error("Angka");
          return {id:String(i+1),indicator:i,target,achieved,notes:String(found?.notes||""),updatedAt:found?.updatedAt||""};
        });
        state.records = normalized; saveState(); renderSpm(); renderDashboard(); showToast("Cadangan berhasil diimpor.");
      } catch (_) { showToast("File tidak sesuai format cadangan E-PUSBONAT."); }
      $("jsonFile").value = "";
    };
    reader.readAsText(file);
  }

  document.querySelectorAll(".nav-item").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.page)));
  document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.go)));
  $("mobileMenu").addEventListener("click",()=> $("sidebar").classList.toggle("open"));
  document.addEventListener("click",e=>{
    if (window.innerWidth<=760 && $("sidebar").classList.contains("open") && !$("sidebar").contains(e.target) && !$("mobileMenu").contains(e.target)) $("sidebar").classList.remove("open");
    const edit = e.target.closest("[data-edit]");
    if (edit) openModal(Number(edit.dataset.edit));
    const cluster = e.target.closest("[data-cluster]");
    if (cluster) renderClusterDetail(cluster.dataset.cluster);
  });
  $("refreshDashboard").addEventListener("click",()=>{renderDashboard();showToast("Ringkasan diperbarui dari data lokal.");});
  $("addSpm").addEventListener("click",()=>openModal());
  $("closeModal").addEventListener("click",closeModal);
  $("cancelModal").addEventListener("click",closeModal);
  $("spmModal").addEventListener("click",e=>{if(e.target===$("spmModal"))closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  $("spmForm").addEventListener("submit",e=>{
    e.preventDefault();
    const index = Number($("formIndicator").value);
    const target = Number($("formTarget").value), achieved = Number($("formAchieved").value);
    if (!Number.isInteger(target)||!Number.isInteger(achieved)||target<0||achieved<0) {showToast("Sasaran dan capaian harus bilangan bulat nol atau lebih.");return;}
    if (target>0 && achieved>target) {
      if (!confirm("Capaian lebih besar dari sasaran. Simpan angka ini?")) return;
    }
    state.records[index] = {id:String(index+1),indicator:index,target,achieved,notes:$("formNotes").value.trim(),updatedAt:new Date().toISOString()};
    saveState(); renderSpm(); renderDashboard(); closeModal(); showToast("Data indikator berhasil disimpan di browser ini.");
  });
  $("spmSearch").addEventListener("input",renderSpm);
  $("spmFilter").addEventListener("change",renderSpm);
  $("exportJson").addEventListener("click",exportJson);
  $("exportCsv").addEventListener("click",exportCsv);
  $("importJson").addEventListener("click",()=>$("jsonFile").click());
  $("jsonFile").addEventListener("change",e=>importJsonFile(e.target.files[0]));
  $("todayLabel").textContent = new Intl.DateTimeFormat("id-ID",{weekday:"short",day:"2-digit",month:"short",year:"numeric"}).format(new Date());
  renderDashboard(); renderSpm(); renderClusters();
})();