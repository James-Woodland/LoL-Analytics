/** @type {import('./$types').PageLoad} */
export default function searhcTricode(filterText){
    if (!filterText.length) return Promise.resolve([]);
	
    filterText = filterText ? filterText.replace(' ','_') : '';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/Drafting/Tricodes/${filterText}`);
        xhr.send();

        xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            setTimeout(resolve(JSON.parse(xhr.response).sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            })), 2000);
        } else {
            reject()
        }
        };
    });
}