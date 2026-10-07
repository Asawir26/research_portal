const API = '/api/opportunities';
const $ = (id) => document.getElementById(id);
const FIELDS = ['title', 'description', 'research_area', 'faculty_name', 'department',
  'required_skills', 'available_positions', 'application_deadline', 'status'];
const REQUIRED = FIELDS.filter((f) => f !== 'status');

function showMessage(text, type) {
  const m = $('message');
  m.textContent = text;
  m.className = 'message ' + type;
  setTimeout(() => m.classList.add('hidden'), 5000);
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : s;
  return d.innerHTML;
}

async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = data.details ? ': ' + data.details.join(', ') : '';
    throw new Error(`${res.status} - ${data.error || 'Request failed'}${details}`);
  }
  return data;
}

async function loadList() {
  try {
    const items = await request(API);
    $('list').innerHTML = items.length ? items.map((o) => `
      <tr>
        <td>${o.id}</td><td>${esc(o.title)}</td><td>${esc(o.research_area)}</td>
        <td>${esc(o.faculty_name)}</td><td>${o.available_positions}</td>
        <td>${esc(o.application_deadline)}</td>
        <td><span class="badge ${o.status}">${o.status}</span></td>
        <td>
          <button onclick="viewOne(${o.id})">View</button>
          <button class="secondary" onclick="editOne(${o.id})">Edit</button>
          ${o.status === 'Open' ? `<button class="warn" onclick="closeOne(${o.id})">Close</button>` : ''}
          <button class="danger" onclick="deleteOne(${o.id})">Delete</button>
        </td>
      </tr>`).join('') : '<tr><td colspan="8">No opportunities found.</td></tr>';
  } catch (e) {
    showMessage('Error loading opportunities: ' + e.message, 'error');
  }
}

async function viewOne(id) {
  try {
    const o = await request(`${API}/${id}`);
    $('detailsBody').innerHTML = `
      <div class="detail-item"><b>ID:</b> ${o.id}</div>
      <div class="detail-item"><b>Title:</b> ${esc(o.title)}</div>
      <div class="detail-item"><b>Description:</b> ${esc(o.description)}</div>
      <div class="detail-item"><b>Research Area:</b> ${esc(o.research_area)}</div>
      <div class="detail-item"><b>Faculty Member:</b> ${esc(o.faculty_name)}</div>
      <div class="detail-item"><b>Department:</b> ${esc(o.department)}</div>
      <div class="detail-item"><b>Required Skills:</b> ${esc(o.required_skills)}</div>
      <div class="detail-item"><b>Available Positions:</b> ${o.available_positions}</div>
      <div class="detail-item"><b>Application Deadline:</b> ${esc(o.application_deadline)}</div>
      <div class="detail-item"><b>Status:</b> <span class="badge ${o.status}">${o.status}</span></div>`;
    $('details').classList.remove('hidden');
  } catch (e) {
    showMessage('Error: ' + e.message, 'error');
    loadList();
  }
}

function clearErrors() {
  document.querySelectorAll('.err').forEach((e) => e.remove());
  document.querySelectorAll('.invalid').forEach((e) => e.classList.remove('invalid'));
}

function openForm(o) {
  clearErrors();
  $('form').reset();
  $('oppId').value = o ? o.id : '';
  $('formTitle').textContent = o ? 'Update Opportunity' : 'Create Opportunity';
  FIELDS.forEach((f) => { $(f).value = o ? o[f] : (f === 'status' ? 'Open' : ''); });
  $('formSection').classList.remove('hidden');
  $('formSection').scrollIntoView();
}

async function editOne(id) {
  try {
    openForm(await request(`${API}/${id}`));
  } catch (e) {
    showMessage('Error: ' + e.message, 'error');
    loadList();
  }
}

async function closeOne(id) {
  try {
    await request(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Closed' })
    });
    showMessage('Opportunity closed successfully.', 'success');
    loadList();
  } catch (e) {
    showMessage('Error: ' + e.message, 'error');
  }
}

async function deleteOne(id) {
  if (!confirm('Delete this opportunity?')) return;
  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    showMessage('Opportunity deleted successfully.', 'success');
    $('details').classList.add('hidden');
    loadList();
  } catch (e) {
    showMessage('Error: ' + e.message, 'error');
    loadList();
  }
}

function validateForm() {
  clearErrors();
  let ok = true;
  REQUIRED.forEach((f) => {
    const el = $(f);
    let msg = '';
    if (el.value.trim() === '') msg = 'This field is required';
    else if (f === 'available_positions' && (!Number.isInteger(Number(el.value)) || Number(el.value) < 0)) {
      msg = 'Must be a non-negative whole number';
    }
    if (msg) {
      ok = false;
      el.classList.add('invalid');
      const s = document.createElement('span');
      s.className = 'err';
      s.textContent = msg;
      el.insertAdjacentElement('afterend', s);
    }
  });
  return ok;
}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) {
    showMessage('Please fix the highlighted fields.', 'error');
    return;
  }
  const body = {};
  FIELDS.forEach((f) => { body[f] = $(f).value.trim(); });
  body.available_positions = Number(body.available_positions);
  const id = $('oppId').value;
  try {
    await request(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    showMessage(id ? 'Opportunity updated successfully.' : 'Opportunity created successfully.', 'success');
    $('formSection').classList.add('hidden');
    loadList();
  } catch (err) {
    showMessage('Error: ' + err.message, 'error');
  }
});

$('newBtn').addEventListener('click', () => openForm(null));
$('cancelBtn').addEventListener('click', () => $('formSection').classList.add('hidden'));
$('closeDetails').addEventListener('click', () => $('details').classList.add('hidden'));

loadList();
