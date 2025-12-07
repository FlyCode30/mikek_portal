/**
 * I left out the delete routes because it didn't make any sense to include that. Staff would normally never be allowed to delete a patient.
 * This code is going with the assumption that we have a patient object, and that patient object is basically whatever is 
 * in the staff tracker. As Chat explained to me, the front-end can just send the whole objec, and the backend decides to what to take from it
 *   */ 

const API_BASE = '/api/triage';

async function addPatient(patient) {
    const res = await fetch(`${API_BASE}/addPatient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    });
    if (!res.ok) throw new Error(`Failed to add patient: ${res.status}`);
    return res.json();
}
 /**
 * patient object is probably going to be the tracker itself. I asked chat, 
 * and it said as long as the object contains all of the requested fields, it will work, even if 
 * the object has more. So if our tracker has, just as an example, 7 fields, but we only need 3,
 * we can just send the whole object. 
 */

async function updatePatientDim(patient) {
    // Use POST to match server.js
    const res = await fetch(`${API_BASE}/updatePatientDim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    });
    if (!res.ok) throw new Error(`Failed to update patient: ${res.status}`);
    return res.json();
}

async function addPatientTracker(patient) {
    // Use POST to match server.js
    const res = await fetch(`${API_BASE}/addPatientTracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    });
    if (!res.ok) throw new Error(`Failed to update patient: ${res.status}`);
    return res.json();
}

async function getPtList(patientId = null) {
    const url = patientId
        ? `${API_BASE}/getPtList?pt_id=${encodeURIComponent(patientId)}`
        : `${API_BASE}/getPtList`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch patient list: ${res.status}`);
    return res.json();
}

window.getPtList = getPtList;
window.addPatient = addPatient;
window.updatePatientDim = updatePatientDim;
window.addPatientTracker = addPatientTracker;