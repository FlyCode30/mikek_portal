/**
 * I left out the delete routes because it didn't make any sense to include that. Staff would normally never be allowed to delete a patient.
 * This code is going with the assumption that we have a patient object, and that patient object is basically whatever is 
 * in the staff tracker. As Chat explained to me, the front-end can just send the whole objec, and the backend decides to what to take from it
 *   */ 

const API_BASE = '/api/triage';

async function getPtList() {;
    const res = await fetch("json/pt_list.json");
    if (!res.ok) throw new Error(`Failed to fetch patient list: ${res.status}`);
    return res.json();
}

window.getPtList = getPtList;
