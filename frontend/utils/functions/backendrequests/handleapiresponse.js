export default async function handleApiResponse(res, needLoad=false) {
    const internalServerError = res.status === 500
    if (internalServerError) {
        return {
            ok: false,
            load: {
                name: 'Internal Server Error',
                message: "Our server has encountered an unexpected error!",
                status: 500
            }
        }
    }
    if (needLoad) { //needLoad is if the frontend is expecting to receive something back from the backend with the response, like an id.
        return {
            ok: res.ok,
            load: await res.json()
        }
    } else {
        return {
            ok: res.ok,
            load: !res.ok && await res.json()
        }
    }
}