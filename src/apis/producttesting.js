const url = process.env.REACT_APP_MODE == 'live' ? 'https://www.getproductfeedback.com' : ''
const routeUrl = `${url}/flask/producttesting`

export const submitFeedback = data => {
	return fetch(`${routeUrl}/submit_feedback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}

export const getRejections = data => {
	return fetch(`${routeUrl}/get_rejections`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
