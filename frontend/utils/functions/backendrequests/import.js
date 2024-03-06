const importCollection = (spreadsheetLink) => {
    fetch(`http://localhost:3000/collections/new/import`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export {importCollection}