const routeUrl = `/flask/producttesting`

export const submitFeedback = data => {
	return fetch(`${routeUrl}/submit_feedback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
}
