const createNewCollection = (formData) => {
    fetch('http://localhost:3000/collections/new', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
}

export {createNewCollection}